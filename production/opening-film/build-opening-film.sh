#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
production="$root/production/opening-film"
raw="$production/raw"
rendered="$production/rendered"
output="$root/assets/cinematic"

required=(
  "$raw/shot-01-breakdown.mp4"
  "$raw/shot-02-cleanup.mp4"
  "$raw/shot-03-beach.mp4"
  "$rendered/discovery-email.png"
  "$rendered/organized-inbox.png"
  "$rendered/calendar-resolution.png"
  "$rendered/review-packet.png"
  "$rendered/approval-queue.png"
  "$rendered/overlay-pressure-missed.png"
  "$rendered/overlay-pressure-email.png"
  "$rendered/overlay-pressure-texts.png"
  "$rendered/overlay-pressure-calendar.png"
  "$rendered/overlay-pressure-spreadsheet.png"
  "$rendered/overlay-pressure-invoice.png"
  "$rendered/overlay-beach-headline.png"
  "$rendered/overlay-beach-tagline.png"
  "$production/opening-film.ass"
)
for path in "${required[@]}"; do
  test -f "$path" || { echo "Missing required input: $path" >&2; exit 1; }
done

normalize="fps=24,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,format=yuv420p"

ffmpeg -hide_banner -loglevel warning -y \
  -i "$raw/shot-01-breakdown.mp4" \
  -framerate 24 -loop 1 -t 2.2 -i "$rendered/discovery-email.png" \
  -i "$raw/shot-02-cleanup.mp4" \
  -framerate 24 -loop 1 -t 1.0 -i "$rendered/organized-inbox.png" \
  -framerate 24 -loop 1 -t 1.0 -i "$rendered/calendar-resolution.png" \
  -framerate 24 -loop 1 -t 1.0 -i "$rendered/review-packet.png" \
  -framerate 24 -loop 1 -t 1.4 -i "$rendered/approval-queue.png" \
  -i "$raw/shot-03-beach.mp4" \
  -framerate 24 -loop 1 -t 24 -i "$rendered/overlay-pressure-missed.png" \
  -framerate 24 -loop 1 -t 24 -i "$rendered/overlay-pressure-email.png" \
  -framerate 24 -loop 1 -t 24 -i "$rendered/overlay-pressure-texts.png" \
  -framerate 24 -loop 1 -t 24 -i "$rendered/overlay-pressure-calendar.png" \
  -framerate 24 -loop 1 -t 24 -i "$rendered/overlay-pressure-spreadsheet.png" \
  -framerate 24 -loop 1 -t 24 -i "$rendered/overlay-pressure-invoice.png" \
  -framerate 24 -loop 1 -t 24 -i "$rendered/overlay-beach-headline.png" \
  -framerate 24 -loop 1 -t 24 -i "$rendered/overlay-beach-tagline.png" \
  -filter_complex "
    [0:v]${normalize},trim=start=0:end=5.8,setpts=PTS-STARTPTS[v0];
    [1:v]${normalize},trim=duration=2.2,setpts=PTS-STARTPTS[v1];
    [2:v]${normalize},split=2[s2a][s2b];
    [s2a]trim=start=0:end=1.4,setpts=PTS-STARTPTS[v2];
    [3:v]${normalize},trim=duration=1.0,setpts=PTS-STARTPTS[v3];
    [4:v]${normalize},trim=duration=1.0,setpts=PTS-STARTPTS[v4];
    [5:v]${normalize},trim=duration=1.0,setpts=PTS-STARTPTS[v5];
    [6:v]${normalize},trim=duration=1.4,setpts=PTS-STARTPTS[v6];
    [s2b]trim=start=5.8:end=8.0,setpts=PTS-STARTPTS[v7];
    [7:v]${normalize},trim=start=0:end=8.0,setpts=PTS-STARTPTS[v8];
    [v0][v1][v2][v3][v4][v5][v6][v7][v8]concat=n=9:v=1:a=0[story];
    [8:v]fps=24,format=rgba[pressure0];
    [9:v]fps=24,format=rgba[pressure1];
    [10:v]fps=24,format=rgba[pressure2];
    [11:v]fps=24,format=rgba[pressure3];
    [12:v]fps=24,format=rgba[pressure4];
    [13:v]fps=24,format=rgba[pressure5];
    [14:v]fps=24,format=rgba[beach0];
    [15:v]fps=24,format=rgba[beach1];
    [story][pressure0]overlay=enable='between(t,0.4,2.2)'[o0];
    [o0][pressure1]overlay=enable='between(t,1.15,3.1)'[o1];
    [o1][pressure2]overlay=enable='between(t,2.0,4.1)'[o2];
    [o2][pressure3]overlay=enable='between(t,2.8,5.3)'[o3];
    [o3][pressure4]overlay=enable='between(t,3.5,5.75)'[o4];
    [o4][pressure5]overlay=enable='between(t,4.1,5.75)'[o5];
    [o5][beach0]overlay=enable='between(t,20.2,24.0)'[o6];
    [o6][beach1]overlay=enable='between(t,22.0,24.0)'[master]
  " \
  -map "[master]" -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -r 24 -t 24 -movflags +faststart "$output/mote-ops-opening-1080.mp4"

ffmpeg -hide_banner -loglevel warning -y -i "$output/mote-ops-opening-1080.mp4" \
  -vf "scale=1280:720:flags=lanczos" -an -c:v libx264 -preset slow -crf 20 \
  -pix_fmt yuv420p -r 24 -t 24 -movflags +faststart \
  "$output/mote-ops-opening-720.mp4"

node "$production/build-poster.mjs" \
  "$output/mote-ops-opening-1080.mp4" \
  "$output/mote-ops-opening-poster.webp"
