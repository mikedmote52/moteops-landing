#!/usr/bin/env bash
set -euo pipefail

chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
here="$(cd "$(dirname "$0")" && pwd)"
raw="$here/raw"
output="$here/rendered"
profile="$(mktemp -d "${TMPDIR:-/tmp}/mote-monitor-chrome.XXXXXX")"
trap 'rm -rf "$profile"' EXIT
mkdir -p "$output"

ffmpeg -hide_banner -loglevel warning -y \
  -ss 0.8 -i "$raw/shot-02-cleanup.mp4" -frames:v 1 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  "$output/monitor-office.png"

plates=(
  organized-inbox
  calendar-resolution
  review-packet
  approval-queue
)

for plate in "${plates[@]}"; do
  screenshot="$output/monitor-$plate.png"
  rm -f "$screenshot"
  "$chrome" \
    --headless=new \
    --allow-file-access-from-files \
    --disable-background-networking \
    --disable-component-update \
    --disable-gpu \
    --hide-scrollbars \
    --no-first-run \
    --force-device-scale-factor=1 \
    --user-data-dir="$profile" \
    --window-size=1920,1080 \
    --screenshot="$screenshot" \
    "file://$here/monitor-plates.html?plate=$plate" >/dev/null 2>&1 &
  chrome_pid=$!
  for _ in {1..100}; do
    test -s "$screenshot" && break
    sleep .1
  done
  if ! test -s "$screenshot"; then
    kill "$chrome_pid" 2>/dev/null || true
    wait "$chrome_pid" 2>/dev/null || true
    echo "Chrome did not render monitor-$plate within 10 seconds" >&2
    exit 1
  fi
  kill "$chrome_pid" 2>/dev/null || true
  wait "$chrome_pid" 2>/dev/null || true
done
