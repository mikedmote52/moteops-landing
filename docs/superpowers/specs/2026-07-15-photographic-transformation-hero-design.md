# Photographic Transformation Hero Design

Date: 2026-07-15

## Objective

Replace the abstract hero diagram with a realistic visual story that a small business owner understands without interpreting labels. The visual must make the transformation immediate:

1. The owner is overwhelmed by scattered work.
2. Mote Ops organizes and prepares the work.
3. The owner receives a short list of clear decisions.

## Approved Direction

Use the generated photographic concept as the visual foundation. It shows the same owner moving from a crowded desk and overflowing inbox to a visible Mote Ops agent workspace and a calm owner brief.

Generated source:

`/Users/michaelmote/.codex/generated_images/019f5241-c6dd-7cf2-a952-51dd214a43be/exec-db068345-fb35-490c-83b5-9ae4cc67e0f4.png`

Final site assets:

1. `assets/moteops-transformation-hero-v1.png` for wide screens.
2. `assets/moteops-transformation-hero-mobile-v1.png` for narrow screens.

The mobile asset will use a vertical composition with the same three moments so the story remains readable without shrinking the wide image into an illegible thumbnail.

## Hero Structure

The hero keeps its existing headline, supporting copy, booking action, secondary action, and trust statements.

The current `.hero-system-plate` diagram is removed completely.

The new visual appears as a photographic figure with:

1. The photograph.
2. Three short labels beneath it: `Before`, `Mote Ops working`, and `Three decisions need you`.
3. A compact disclosure: `Illustrative demonstration using fictional business information.`

The photograph must not imply that the screen is a live connection or a measured client result.

## Desktop Layout

Keep the two column hero. The copy remains on the left. The photographic figure fills the right column and may extend slightly beyond the normal content width to create visual impact.

The figure uses a dark frame, restrained orange offset shadow, and no blue decorative treatment. The complete before, during, and after story remains visible.

The image must remain large enough for the overwhelmed desk, agent workspace, and simplified owner brief to be distinguishable at first glance.

## Phone Layout

The phone layout places the vertical photographic asset after the hero actions and before the trust statements.

The mobile composition shows:

1. The overwhelmed owner and crowded inbox at the top.
2. The Mote Ops agent workspace in the middle.
3. The calm owner brief and drafted email at the bottom.

The image fills the available width and does not require horizontal scrolling. The three text labels stack beneath the image. The sticky booking action must not cover the visual labels.

## Accessibility

Use an actual `img` element inside `picture`, not a CSS background.

Alternative text:

`A small business owner moves from an overflowing inbox, missed calls, paperwork, and calendar conflicts to a Mote Ops agent organizing the work and a simple screen showing three decisions and a drafted email ready for approval.`

The three labels remain real text outside the image. The visual is supplementary because the hero copy already explains the service.

## Demonstration Relationship

The hero photograph introduces the transformation. It does not replace the working demonstrations.

The later demonstration section remains the place where visitors interact with:

1. The Owner Control Center.
2. CC Care Hub.
3. The Customer Response Center.

A later design cycle will upgrade those demonstrations into complete application views. This hero change stays focused on replacing the confusing abstract visual.

## Truth Boundaries

1. All visible records and interface content in the image are illustrative.
2. The photograph must not be described as a real customer screenshot.
3. The generated interface must not be described as a live connection.
4. The site must not claim that Mote Ops processed 143 real emails or produced measured client results.
5. The disclosure remains visible near the image.

## Verification

Automated checks must confirm:

1. The old hero diagram classes are absent from the hero HTML.
2. The desktop and mobile assets exist.
3. The `picture` element contains both source sizes and the approved alternative text.
4. The three visible labels and disclosure are present.
5. No new network requests or external image sources are added.
6. The approved non blue palette remains unchanged.

Manual checks must confirm:

1. The full transformation is understandable at desktop width.
2. The vertical story is readable at 390 by 844 pixels.
3. The hero headline and primary action remain dominant.
4. The image does not cause horizontal page overflow.
5. The sticky booking action does not cover the labels.
