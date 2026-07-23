#!/usr/bin/env bash
set -euo pipefail

chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
here="$(cd "$(dirname "$0")" && pwd)"
output="$here/rendered/interfaces"
profile="$(mktemp -d "${TMPDIR:-/tmp}/mote-v3-interfaces-chrome.XXXXXX")"
trap 'rm -rf "$profile"' EXIT
mkdir -p "$output"

plates=(
  invitation
  invitation-clicked
  onboarding-tools
  onboarding-work
  onboarding-approval
  inbox
  inbox-approved
  calendar
  calendar-approved
  calls
  calls-approved
  finance
  finance-approved
  dashboard-zero
  phone-zero
  opening-copy
  closing-copy
)

for plate in "${plates[@]}"; do
  window_size="1600,900"
  if [[ "$plate" == "phone-zero" ]]; then
    window_size="1080,1920"
  elif [[ "$plate" == "opening-copy" || "$plate" == "closing-copy" ]]; then
    window_size="1920,1080"
  fi

  screenshot="$output/$plate.png"
  rm -f "$screenshot"
  "$chrome" \
    --headless=new \
    --disable-background-networking \
    --disable-component-update \
    --disable-gpu \
    --default-background-color=00000000 \
    --hide-scrollbars \
    --no-first-run \
    --force-device-scale-factor=1 \
    --user-data-dir="$profile/$plate" \
    --window-size="$window_size" \
    --screenshot="$screenshot" \
    "file://$here/interfaces.html?plate=$plate" >/dev/null 2>&1 &
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
