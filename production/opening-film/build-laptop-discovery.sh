#!/usr/bin/env bash
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
raw="$here/raw"
rendered="$here/rendered"
track="$here/laptop-track.ffscript"
email_hold="2.2"
click_hold="0.35"
site_hold="1.20"
moving_inbox="1.25"

required=(
  "$raw/shot-01-breakdown.mp4"
  "$rendered/laptop-inbox.png"
  "$rendered/laptop-email.png"
  "$rendered/laptop-email-click.png"
  "$rendered/laptop-site.png"
  "$track"
)
for path in "${required[@]}"; do
  test -f "$path" || { echo "Missing required input: $path" >&2; exit 1; }
done

normalize="fps=24,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1"
track_dir="$(mktemp -d "${TMPDIR:-/tmp}/mote-laptop-track.XXXXXX")"
trap 'rm -rf "$track_dir"' EXIT

for frame in $(seq 0 29); do
  coords="$(awk -v target="$frame" '
    /^#/ || NF == 0 { next }
    $1 == target {
      for (field = 2; field <= 9; field++) {
        printf "%d%s", $field, (field == 9 ? ORS : OFS)
      }
      printed = 1
      exit
    }
    $1 > target && have_previous {
      progress = (target - previous[1]) / ($1 - previous[1])
      for (field = 2; field <= 9; field++) {
        value = previous[field] + progress * ($field - previous[field])
        printf "%d%s", int(value + 0.5), (field == 9 ? ORS : OFS)
      }
      printed = 1
      exit
    }
    {
      for (field = 1; field <= 9; field++) previous[field] = $field
      have_previous = 1
    }
    END {
      if (!printed && have_previous) {
        for (field = 2; field <= 9; field++) {
          printf "%d%s", previous[field], (field == 9 ? ORS : OFS)
        }
      }
    }
  ' "$track")"
  read -r tlx tly trx try blx bly brx bry <<< "$coords"

  ffmpeg -hide_banner -loglevel error -y \
    -loop 1 -i "$rendered/laptop-inbox.png" -frames:v 1 \
    -vf "scale=1920:1080,format=rgba,perspective=
      x0=${tlx}:y0=${tly}:
      x1=${trx}:y1=${try}:
      x2=${blx}:y2=${bly}:
      x3=${brx}:y3=${bry}:
      sense=destination:eval=init" \
    "$track_dir/inbox-$(printf '%02d' "$frame").png"
done

ffmpeg -hide_banner -loglevel warning -y \
  -i "$raw/shot-01-breakdown.mp4" \
  -ss 7.0 -i "$raw/shot-01-breakdown.mp4" \
  -framerate 24 -i "$track_dir/inbox-%02d.png" \
  -framerate 24 -loop 1 -t "$email_hold" -i "$rendered/laptop-email.png" \
  -framerate 24 -loop 1 -t "$click_hold" -i "$rendered/laptop-email-click.png" \
  -framerate 24 -loop 1 -t "$site_hold" -i "$rendered/laptop-site.png" \
  -filter_complex "
    [0:v]${normalize},trim=start=5.5:end=6.75,setpts=PTS-STARTPTS,
    split=3[move_key_source][move_restore_top_source][move_restore_left_source];
    [move_key_source]format=rgba,chromakey=0x008a50:0.12:0.03[move_fg];
    [move_restore_top_source]crop=1920:500:0:0[move_restore_top];
    [move_restore_left_source]crop=1450:580:0:500[move_restore_left];
    [2:v]format=rgba[tracked_inbox];
    [tracked_inbox][move_fg]overlay=shortest=1[move_keyed];
    [move_keyed][move_restore_top]overlay=x=0:y=0:shortest=1[move_top_restored];
    [move_top_restored][move_restore_left]overlay=x=0:y=500:shortest=1,
    format=yuv420p[moving];

    [1:v]${normalize},trim=duration=0.041667,setpts=PTS-STARTPTS,
    tpad=stop_mode=clone:stop_duration=3.75,split=3[hold_email][hold_click][hold_site];
    [hold_email]trim=duration=${email_hold},setpts=PTS-STARTPTS,
    format=rgba,chromakey=0x008a50:0.12:0.03[email_fg];
    [hold_click]trim=start=${email_hold}:end=2.55,setpts=PTS-STARTPTS,
    format=rgba,chromakey=0x008a50:0.12:0.03[click_fg];
    [hold_site]trim=start=2.55:end=3.75,setpts=PTS-STARTPTS,
    format=rgba,chromakey=0x008a50:0.12:0.03[site_fg];

    [3:v]scale=1300:790,format=rgba,pad=1920:1080:300:120:color=black[email_screen];
    [4:v]scale=1300:790,format=rgba,pad=1920:1080:300:120:color=black[click_screen];
    [5:v]scale=1300:790,format=rgba,pad=1920:1080:300:120:color=black[site_screen];
    [email_screen][email_fg]overlay=shortest=1,format=yuv420p[email_comp];
    [click_screen][click_fg]overlay=shortest=1,format=yuv420p[click_comp];
    [site_screen][site_fg]overlay=shortest=1,format=yuv420p[site_comp];
    [email_comp][click_comp][site_comp]concat=n=3:v=1:a=0,settb=1/24[frontal0];
    [frontal0]scale=
      w='trunc(1920*(1+0.015*min(n,89)/89)/2)*2':
      h='trunc(1080*(1+0.015*min(n,89)/89)/2)*2':
      eval=frame,crop=1920:1080,setsar=1[frontal];
    [moving][frontal]concat=n=2:v=1:a=0,settb=1/24[laptop_story]
  " \
  -map "[laptop_story]" -an -c:v libx264 -preset slow -crf 18 \
  -pix_fmt yuv420p -r 24 -t 5.0 -movflags +faststart \
  "$rendered/laptop-discovery.mp4"
