# Mobile Transformation Captions Design

## Goal

Make the phone version of the photographic transformation understandable at a glance by placing each stage caption directly after the photo it describes.

## Current problem

The phone asset contains three vertically stacked scenes, but all three captions appear together beneath the complete image. This makes the captions look detached from their scenes and forces the visitor to infer which caption belongs to which photo.

## Approved design

Desktop keeps the current wide image and three horizontal captions.

Phone presents the portrait image as three visible crops in this exact sequence:

1. The overwhelmed owner scene, followed by `Before`.
2. The organizing screen scene, followed by `Mote Ops working`.
3. The simplified owner brief and email draft scene, followed by `Three decisions need you`.

The fictional information disclosure appears once after the third caption.

## Implementation approach

Use the existing portrait image as the source for all three phone crops. The page will render a phone only segmented sequence with one crop and one caption per stage. The existing desktop picture and caption row remain the desktop presentation.

This avoids regenerating or duplicating photographic assets while making the relationship between scene and caption explicit in the document structure.

## Responsive behavior

At widths above 760 pixels, show the existing desktop picture and horizontal caption row.

At widths of 760 pixels or less, hide the desktop presentation and show the segmented phone sequence. Each crop fills the card width with no horizontal overflow. Captions sit immediately beneath their matching crop.

## Accessibility

The phone sequence uses one ordered list with three items. Each item contains a decorative crop and visible text. The overall figure retains the existing descriptive alternative text through an accessible text description without causing the same description to be announced three times.

## Verification

Automated tests will require the phone only segmented structure and the exact caption order. Browser verification will check desktop and a 390 by 844 phone viewport, image loading, caption placement, overflow, sticky action overlap, and console errors.

## Out of scope

No copy changes, photography changes, hero message changes, demonstration changes, navigation changes, or desktop redesign are included.
