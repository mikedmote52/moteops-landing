#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
raw="$root/production/opening-film-v3/raw"
plates="$root/production/opening-film-v3/rendered/interfaces"
rendered="$root/production/opening-film-v3/rendered"
segments="$rendered/segments"
outputs="$root/assets/cinematic"

mkdir -p "$segments" "$outputs"

for file in \
  "$raw/shot-01-chaos-attempt-03.mp4" \
  "$raw/shot-02-discovery.mp4" \
  "$raw/shot-03-onboarding.mp4" \
  "$raw/shot-04-inbox-calendar.mp4" \
  "$raw/shot-05-calls-finance.mp4" \
  "$raw/shot-06-control-restored.mp4" \
  "$raw/shot-07-beach-payoff.mp4" \
  "$plates/opening-copy.png" \
  "$plates/closing-copy.png" \
  "$plates/phone-zero.png"; do
  test -f "$file" || { echo "Missing required input: $file" >&2; exit 1; }
done

encode_segment=(
  -an
  -r 24
  -c:v libx264
  -preset slow
  -crf 18
  -pix_fmt yuv420p
  -movflags +faststart
)

# The office device is intentionally treated as a physical screen: every
# deterministic plate is perspective-warped behind the keyed laptop foreground.
laptop_perspective="scale=1920:1080,format=rgba,perspective=x0=1240:y0=505:x1=1562:y1=532:x2=1198:y2=711:x3=1512:y3=770:sense=destination:eval=init,setpts=PTS-STARTPTS"
laptop_foreground="colorkey=0x008a50:0.08:0.03,format=rgba"

ffmpeg -hide_banner -loglevel error -y \
  -i "$raw/shot-01-chaos-attempt-03.mp4" \
  -loop 1 -i "$plates/opening-copy.png" \
  -filter_complex "
    [0:v]trim=duration=6,setpts=PTS-STARTPTS[scene];
    [1:v]format=rgba,fade=t=in:st=0.35:d=0.35:alpha=1,
      fade=t=out:st=5.35:d=0.35:alpha=1,setpts=PTS-STARTPTS[copy];
    [scene][copy]overlay=shortest=1:format=auto[out]
  " \
  -map "[out]" -frames:v 144 "${encode_segment[@]}" \
  "$segments/01-chaos.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$raw/shot-02-discovery.mp4" \
  -loop 1 -i "$plates/invitation.png" \
  -loop 1 -i "$plates/invitation-clicked.png" \
  -filter_complex "
    [0:v]trim=duration=8,setpts=PTS-STARTPTS,$laptop_foreground[fg];
    [1:v]$laptop_perspective[p0];
    [2:v]$laptop_perspective[p1];
    [p0][p1]overlay=enable='gte(t,6.4)'[screen];
    [screen][fg]overlay=shortest=1:format=auto[out]
  " \
  -map "[out]" -frames:v 192 "${encode_segment[@]}" \
  "$segments/02-discovery.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$raw/shot-03-onboarding.mp4" \
  -loop 1 -i "$plates/onboarding-tools.png" \
  -loop 1 -i "$plates/onboarding-work.png" \
  -loop 1 -i "$plates/onboarding-approval.png" \
  -filter_complex "
    [0:v]trim=duration=5,setpts=PTS-STARTPTS,$laptop_foreground[fg];
    [1:v]$laptop_perspective[p0];
    [2:v]$laptop_perspective[p1];
    [3:v]$laptop_perspective[p2];
    [p0][p1]overlay=enable='gte(t,1.7)'[s1];
    [s1][p2]overlay=enable='gte(t,3.4)'[screen];
    [screen][fg]overlay=shortest=1:format=auto[out]
  " \
  -map "[out]" -frames:v 120 "${encode_segment[@]}" \
  "$segments/03-onboarding.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$raw/shot-04-inbox-calendar.mp4" \
  -loop 1 -i "$plates/inbox.png" \
  -loop 1 -i "$plates/inbox-approved.png" \
  -loop 1 -i "$plates/calendar.png" \
  -loop 1 -i "$plates/calendar-approved.png" \
  -filter_complex "
    [0:v]trim=duration=8,setpts=PTS-STARTPTS,$laptop_foreground[fg];
    [1:v]$laptop_perspective[p0];
    [2:v]$laptop_perspective[p1];
    [3:v]$laptop_perspective[p2];
    [4:v]$laptop_perspective[p3];
    [p0][p1]overlay=enable='gte(t,2.0)'[s1];
    [s1][p2]overlay=enable='gte(t,4.0)'[s2];
    [s2][p3]overlay=enable='gte(t,6.0)'[screen];
    [screen][fg]overlay=shortest=1:format=auto[out]
  " \
  -map "[out]" -frames:v 192 "${encode_segment[@]}" \
  "$segments/04-inbox-calendar.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$raw/shot-05-calls-finance.mp4" \
  -loop 1 -i "$plates/calls.png" \
  -loop 1 -i "$plates/calls-approved.png" \
  -loop 1 -i "$plates/finance.png" \
  -loop 1 -i "$plates/finance-approved.png" \
  -filter_complex "
    [0:v]trim=duration=8,setpts=PTS-STARTPTS,$laptop_foreground[fg];
    [1:v]$laptop_perspective[p0];
    [2:v]$laptop_perspective[p1];
    [3:v]$laptop_perspective[p2];
    [4:v]$laptop_perspective[p3];
    [p0][p1]overlay=enable='gte(t,2.0)'[s1];
    [s1][p2]overlay=enable='gte(t,4.0)'[s2];
    [s2][p3]overlay=enable='gte(t,6.0)'[screen];
    [screen][fg]overlay=shortest=1:format=auto[out]
  " \
  -map "[out]" -frames:v 192 "${encode_segment[@]}" \
  "$segments/05-calls-finance.mp4"

ffmpeg -hide_banner -loglevel error -y \
  -i "$raw/shot-06-control-restored.mp4" \
  -loop 1 -i "$plates/dashboard-zero.png" \
  -filter_complex "
    [0:v]trim=duration=7,setpts=PTS-STARTPTS,$laptop_foreground[fg];
    [1:v]$laptop_perspective[screen];
    [screen][fg]overlay=shortest=1:format=auto[out]
  " \
  -map "[out]" -frames:v 168 "${encode_segment[@]}" \
  "$segments/06-control-restored.mp4"

# Phone keying is restricted to a tracked device crop so the blue-green ocean
# remains untouched. The readable plate holds while Mike reads, then the screen
# settles to dark as he lowers the phone.
phone_crop="crop=300:380:960:550"
phone_perspective="scale=1920:1080,format=rgba,perspective=x0=1015:y0=589:x1=1128:y1=590:x2=1048:y2=795:x3=1155:y3=788:sense=destination:eval=init,setpts=PTS-STARTPTS"

ffmpeg -hide_banner -loglevel error -y \
  -i "$raw/shot-07-beach-payoff.mp4" \
  -loop 1 -i "$plates/phone-zero.png" \
  -loop 1 -i "$plates/closing-copy.png" \
  -filter_complex "
    [0:v]trim=duration=8,setpts=PTS-STARTPTS,split=2[base][phone-source];
    [phone-source]$phone_crop,colorkey=0x008a50:0.20:0.03,format=rgba[phone-fg];
    [1:v]$phone_perspective,$phone_crop[phone-plate];
    color=c=0x101010:s=300x380:d=8,format=rgba[phone-dark];
    [phone-plate][phone-dark]overlay=enable='gte(t,3.4)'[phone-bg];
    [phone-bg][phone-fg]overlay=shortest=1:format=auto[phone-composite];
    [base][phone-composite]overlay=x=960:y=550:shortest=1[scene];
    [2:v]format=rgba,fade=t=in:st=3.8:d=0.45:alpha=1,
      setpts=PTS-STARTPTS[closing];
    [scene][closing]overlay=shortest=1:format=auto,
      tpad=stop_mode=clone:stop_duration=0.05[out]
  " \
  -map "[out]" -frames:v 192 "${encode_segment[@]}" \
  "$segments/07-beach-payoff.mp4"

concat_file="$rendered/segments.txt"
printf "file '%s'\n" \
  "$segments/01-chaos.mp4" \
  "$segments/02-discovery.mp4" \
  "$segments/03-onboarding.mp4" \
  "$segments/04-inbox-calendar.mp4" \
  "$segments/05-calls-finance.mp4" \
  "$segments/06-control-restored.mp4" \
  "$segments/07-beach-payoff.mp4" > "$concat_file"

master1080="$outputs/mote-ops-opening-v3-1080.mp4"
master720="$outputs/mote-ops-opening-v3-720.mp4"
poster="$outputs/mote-ops-opening-v3-poster.jpg"

ffmpeg -hide_banner -loglevel error -y \
  -f concat -safe 0 -i "$concat_file" \
  -c copy -an -movflags +faststart "$master1080"

ffmpeg -hide_banner -loglevel error -y \
  -i "$master1080" \
  -vf "scale=1280:720:flags=lanczos" \
  -an -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p \
  -movflags +faststart "$master720"

ffmpeg -hide_banner -loglevel error -y \
  -ss 45.5 -i "$master1080" -frames:v 1 -q:v 2 "$poster"

printf '%s\n' "$master1080" "$master720" "$poster"
