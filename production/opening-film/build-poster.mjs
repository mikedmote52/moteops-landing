import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [inputArgument, outputArgument] = process.argv.slice(2);
if (!inputArgument || !outputArgument) {
  throw new Error('Usage: node build-poster.mjs <input.mp4> <output.webp>');
}

const input = resolve(inputArgument);
const output = resolve(outputArgument);
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = mkdtempSync(`${tmpdir()}/mote-opening-poster.`);
const activePortFile = resolve(profile, 'DevToolsActivePort');
const capturePage = new URL('poster-capture.html', import.meta.url);
capturePage.searchParams.set('video', pathToFileURL(input).href);
capturePage.searchParams.set('time', '4.2');

const browser = spawn(chrome, [
  '--headless=new',
  '--allow-file-access-from-files',
  '--disable-background-networking',
  '--disable-component-update',
  '--disable-gpu',
  '--no-first-run',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  capturePage.href,
], { stdio: 'ignore' });

const wait = (milliseconds) => new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));

async function waitForFile(path, timeout = 10000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (existsSync(path)) return;
    await wait(50);
  }
  throw new Error(`Timed out waiting for ${path}`);
}

async function connect(url) {
  return new Promise((resolveConnect, rejectConnect) => {
    const socket = new WebSocket(url);
    socket.addEventListener('open', () => resolveConnect(socket), { once: true });
    socket.addEventListener('error', rejectConnect, { once: true });
  });
}

async function evaluate(socket, expression, id) {
  return new Promise((resolveEvaluation, rejectEvaluation) => {
    const onMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      socket.removeEventListener('message', onMessage);
      if (message.error) rejectEvaluation(new Error(message.error.message));
      else resolveEvaluation(message.result.result.value);
    };
    socket.addEventListener('message', onMessage);
    socket.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: { expression, returnByValue: true },
    }));
  });
}

try {
  await waitForFile(activePortFile);
  const [port] = readFileSync(activePortFile, 'utf8').trim().split('\n');
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
  const page = targets.find(({ type }) => type === 'page');
  if (!page) throw new Error('Chrome did not expose the poster capture page');
  const socket = await connect(page.webSocketDebuggerUrl);
  let posterData = null;
  for (let attempt = 0; attempt < 200 && !posterData; attempt += 1) {
    const result = await evaluate(socket, '({ data: window.posterData, error: window.posterError })', attempt + 1);
    if (result?.error) throw new Error(result.error);
    posterData = result?.data;
    if (!posterData) await wait(50);
  }
  socket.close();
  if (!posterData?.startsWith('data:image/webp;base64,')) {
    throw new Error('Chrome did not produce a WebP poster within 10 seconds');
  }
  writeFileSync(output, Buffer.from(posterData.split(',')[1], 'base64'));
} finally {
  browser.kill();
  if (browser.exitCode === null) {
    await new Promise((resolveExit) => browser.once('exit', resolveExit));
  }
  rmSync(profile, { recursive: true, force: true });
}
