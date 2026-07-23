#!/usr/bin/env bash
set -euo pipefail

chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
here="$(cd "$(dirname "$0")" && pwd)"
output="$here/rendered"
profile="$(mktemp -d "${TMPDIR:-/tmp}/mote-laptop-chrome.XXXXXX")"
trap 'rm -rf "$profile"' EXIT
mkdir -p "$output"

plates=(
  laptop-inbox
  laptop-email
  laptop-email-click
  laptop-site
)

for plate in "${plates[@]}"; do
  screenshot="$output/$plate.png"
  rm -f "$screenshot"
  "$chrome" \
    --headless=new \
    --disable-background-networking \
    --disable-component-update \
    --disable-gpu \
    --hide-scrollbars \
    --no-first-run \
    --force-device-scale-factor=1 \
    --user-data-dir="$profile" \
    --window-size=1600,900 \
    --screenshot="$screenshot" \
    "file://$here/laptop-plates.html?plate=$plate" >/dev/null 2>&1 &
  chrome_pid=$!
  for _ in {1..100}; do
    test -s "$screenshot" && break
    sleep .1
  done
  if ! test -s "$screenshot"; then
    kill "$chrome_pid" 2>/dev/null || true
    wait "$chrome_pid" 2>/dev/null || true
    echo "Chrome did not render $plate within 10 seconds" >&2
    exit 1
  fi
  kill "$chrome_pid" 2>/dev/null || true
  wait "$chrome_pid" 2>/dev/null || true
done
