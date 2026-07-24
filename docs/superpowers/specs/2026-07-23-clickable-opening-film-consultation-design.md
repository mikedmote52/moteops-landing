# Clickable Opening-Film Consultation Action

## Goal

Make the consultation action in the final 3.5 seconds of the approved 50-second Mote Ops opening film genuinely clickable on `moteops.tech`.

## Approved interaction

The film remains unchanged. A real HTML link is positioned over the consultation action during the final card, beginning at 46.5 seconds. It opens the existing Mote Ops booking destination, `https://calendly.com/mikedmote/30min`, in a new tab.

The link remains available after the film ends so the visitor has time to click it. It hides when playback returns to any earlier point, including replay. The existing hero booking action remains the non-video fallback.

## Presentation and accessibility

The overlay follows the final card's consultation-action position as a percentage of the 16:9 video frame, so it stays aligned on desktop and phone. It uses a minimum 44-pixel touch target, visible keyboard focus, meaningful link text, and `rel="noopener noreferrer"`.

The overlay is hidden from pointer and keyboard interaction until the final card begins. It does not block the replay control.

## Behavior ownership

The opening-film markup owns the link. `motion-system.js`, which already owns opening-film playback and replay state, owns the timed visibility state. `opening-film.css` owns positioning, focus treatment, and responsive sizing.

## Verification

Automated contracts will require the real Calendly link, the 46.5-second reveal boundary, replay reset behavior, and the noninteractive hidden state. Browser verification will cover phone and desktop alignment, touch target size, keyboard focus, and successful navigation to the expected Calendly URL.

Production deployment is explicitly approved in this session after verification.
