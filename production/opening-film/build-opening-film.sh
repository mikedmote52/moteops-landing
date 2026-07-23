#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
production="$root/production/opening-film"
raw="$production/raw"
rendered="$production/rendered"
output="$root/assets/cinematic"
actor_attention="2.6"
discovery_hold="2.2"
interface_hold="1.8"
transition="0.291667"
discovery_transition_plate="2.491667"
transition_plate="2.091667"
master_duration="28.0"

required=(
  "$raw/shot-01-breakdown.mp4"
  "$raw/shot-02-cleanup.mp4"
  "$raw/shot-03-beach.mp4"
  "$rendered/monitor-discovery-email.png"
  "$rendered/monitor-organized-inbox.png"
  "$rendered/monitor-calendar-resolution.png"
  "$rendered/monitor-review-packet.png"
  "$rendered/monitor-approval-queue.png"
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
  -i "$raw/shot-02-cleanup.mp4" \
  -framerate 24 -loop 1 -t "$discovery_transition_plate" -i "$rendered/monitor-discovery-email.png" \
  -framerate 24 -loop 1 -t "$interface_hold" -i "$rendered/monitor-organized-inbox.png" \
  -framerate 24 -loop 1 -t "$interface_hold" -i "$rendered/monitor-calendar-resolution.png" \
  -framerate 24 -loop 1 -t "$interface_hold" -i "$rendered/monitor-review-packet.png" \
  -framerate 24 -loop 1 -t "$transition_plate" -i "$rendered/monitor-approval-queue.png" \
  -i "$raw/shot-03-beach.mp4" \
  -framerate 24 -loop 1 -t "$master_duration" -i "$rendered/overlay-pressure-missed.png" \
  -framerate 24 -loop 1 -t "$master_duration" -i "$rendered/overlay-pressure-email.png" \
  -framerate 24 -loop 1 -t "$master_duration" -i "$rendered/overlay-pressure-texts.png" \
  -framerate 24 -loop 1 -t "$master_duration" -i "$rendered/overlay-pressure-calendar.png" \
  -framerate 24 -loop 1 -t "$master_duration" -i "$rendered/overlay-pressure-spreadsheet.png" \
  -framerate 24 -loop 1 -t "$master_duration" -i "$rendered/overlay-pressure-invoice.png" \
  -framerate 24 -loop 1 -t "$master_duration" -i "$rendered/overlay-beach-headline.png" \
  -framerate 24 -loop 1 -t "$master_duration" -i "$rendered/overlay-beach-tagline.png" \
  -filter_complex "
    [0:v]${normalize},trim=start=0:end=5.8,setpts=PTS-STARTPTS[v0];
    [1:v]${normalize},split=2[s1a][s1b];
    [s1a]trim=start=0:end=${actor_attention},setpts=PTS-STARTPTS[v1];
    [2:v]${normalize},trim=duration=${discovery_transition_plate},setpts=PTS-STARTPTS,
    scale=w='trunc(1920*(1+0.012*min(n\,7)/7)/2)*2':h='trunc(1080*(1+0.012*min(n\,7)/7)/2)*2':eval=frame,
    crop=1920:1080,setsar=1[v2];
    [3:v]${normalize},trim=duration=${interface_hold},setpts=PTS-STARTPTS[v3];
    [4:v]${normalize},trim=duration=${interface_hold},setpts=PTS-STARTPTS[v4];
    [5:v]${normalize},trim=duration=${interface_hold},setpts=PTS-STARTPTS[v5];
    [6:v]${normalize},trim=duration=${transition_plate},setpts=PTS-STARTPTS,
    scale=w='trunc(1920*(1.012-0.012*min(n\,7)/7)/2)*2':h='trunc(1080*(1.012-0.012*min(n\,7)/7)/2)*2':eval=frame,
    crop=1920:1080,setsar=1[v6];
    [s1b]trim=start=5.8:end=8.0,setpts=PTS-STARTPTS[v7];
    [7:v]${normalize},trim=start=0:end=8.0,setpts=PTS-STARTPTS[v8];
    [v1][v2]xfade=transition=fade:duration=${transition}:offset=2.308333[monitor_in];
    [monitor_in][v3][v4][v5][v6]concat=n=5:v=1:a=0,settb=1/24[monitor_sequence];
    [monitor_sequence][v7]xfade=transition=fade:duration=${transition}:offset=12.000000[cleanup];
    [v0][cleanup][v8]concat=n=3:v=1:a=0[story];
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
    [o5][beach0]overlay=enable='between(t,24.2,28.0)'[o6];
    [o6][beach1]overlay=enable='between(t,26.0,28.0)'[master]
  " \
  -map "[master]" -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -r 24 -t "$master_duration" -movflags +faststart "$output/mote-ops-opening-1080.mp4"

ffmpeg -hide_banner -loglevel warning -y -i "$output/mote-ops-opening-1080.mp4" \
  -vf "scale=1280:720:flags=lanczos" -an -c:v libx264 -preset slow -crf 20 \
  -pix_fmt yuv420p -r 24 -t "$master_duration" -movflags +faststart \
  "$output/mote-ops-opening-720.mp4"

node "$production/build-poster.mjs" \
  "$output/mote-ops-opening-1080.mp4" \
  "$output/mote-ops-opening-poster.webp"
