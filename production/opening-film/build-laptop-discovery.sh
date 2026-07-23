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

track_filter="$(grep -v '^#' "$track")"
normalize="fps=24,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1"

ffmpeg -hide_banner -loglevel warning -y \
  -i "$raw/shot-01-breakdown.mp4" \
  -ss 7.0 -i "$raw/shot-01-breakdown.mp4" \
  -framerate 24 -loop 1 -t "$moving_inbox" -i "$rendered/laptop-inbox.png" \
  -framerate 24 -loop 1 -t "$email_hold" -i "$rendered/laptop-email.png" \
  -framerate 24 -loop 1 -t "$click_hold" -i "$rendered/laptop-email-click.png" \
  -framerate 24 -loop 1 -t "$site_hold" -i "$rendered/laptop-site.png" \
  -filter_complex "
    $track_filter;
    [0:v]${normalize},trim=start=5.5:end=6.75,setpts=PTS-STARTPTS,
    split=3[move_key_source][move_restore_top_source][move_restore_left_source];
    [move_key_source]format=rgba,chromakey=0x008a50:0.12:0.03[move_fg];
    [move_restore_top_source]crop=1920:500:0:0[move_restore_top];
    [move_restore_left_source]crop=1450:580:0:500[move_restore_left];
    color=c=0xf3efe5:s=1920x1080:r=24:d=${moving_inbox}[move_bg];
    [move_bg][tracked_inbox]overlay=
      x='if(lt(t,0.25),lerp(1630,1450,t/0.25),if(lt(t,0.50),lerp(1450,1440,(t-0.25)/0.25),if(lt(t,0.75),lerp(1440,1460,(t-0.50)/0.25),if(lt(t,1.00),lerp(1460,1500,(t-0.75)/0.25),lerp(1500,1600,min(1,(t-1.00)/0.25))))))':
      y='if(lt(t,0.25),lerp(420,400,t/0.25),if(lt(t,0.50),lerp(400,430,(t-0.25)/0.25),if(lt(t,0.75),lerp(430,460,(t-0.50)/0.25),if(lt(t,1.00),lerp(460,520,(t-0.75)/0.25),lerp(520,580,min(1,(t-1.00)/0.25))))))':
      shortest=1[move_screen];
    [move_screen][move_fg]overlay=shortest=1[move_keyed];
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
