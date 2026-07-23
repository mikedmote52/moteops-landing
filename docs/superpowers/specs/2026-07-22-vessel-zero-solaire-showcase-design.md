# VESSEL ZERO and SOLAIRE / 01 Showcase Design

Date: 2026-07-22

Status: Approved design, awaiting written-spec review
Project: `moteops-landing`

## Purpose

Create two original, portfolio-grade fictional websites for the Mote Ops showcase:

1. **VESSEL ZERO**, an abyssal research program unveiling an autonomous deep-ocean submersible.
2. **SOLAIRE / 01**, a desert observatory whose architecture tracks the sun and opens to the night sky.

The sites must demonstrate that Mote Ops can combine art direction, cinematic generation, interaction design, frontend engineering, mobile execution, and performance discipline. They must feel authored rather than generated.

Both experiences will live as isolated concepts under the existing showcase structure. They will not replace operational client proof or present fictional work as a real engagement.

## Success Criteria

Each site must be:

- Beautiful enough to stand beside recognized immersive product and cultural websites.
- Professional enough to function as serious portfolio evidence.
- Smooth on current desktop and mobile browsers.
- Explicitly labeled as a fictional Mote Ops design concept.
- Built around working interactions rather than decorative controls.
- Usable without sound and understandable without motion.
- Free of generic model-default aesthetics, copy, and imagery.

The pair succeeds when they feel like two different studios authored them. They must not look like palette-swapped versions of one template.

## Reference Review

The visual and interaction direction is informed by specific awarded work. These references provide principles, not layouts or assets to copy.

### VESSEL ZERO references

- [OceanX 2025](https://www.awwwards.com/sites/oceanx-2025), Awwwards Site of the Day: use a mission-based narrative, restrained interface, and one strong spatial device rather than decorative spectacle everywhere.
- [The Sea We Breathe](https://www.awwwards.com/sites/the-sea-we-breathe), Awwwards Site of the Day: anchor immersion in documentary ocean imagery, coordinates, environmental readings, and optional sound.
- [NASA's Immersive Earth](https://winners.webbyawards.com/2024/ai-metaverse-virtual/general-virtual-experiences/science-education/285118/nasas-immersive-earth), Webby and People's Voice winner: make the interaction teach something and keep scientific information primary.
- [Planet Ocean Montpellier](https://www.cssdesignawards.com/sites/planet-ocean-montpellier/35197/), CSS Design Awards Special Kudos: use fullscreen photography and animation in support of a clear environmental promise.

### SOLAIRE / 01 references

- [Infini](https://www.awwwards.com/sites/infini), Awwwards Site of the Day: use a disciplined black-and-white architectural system, large typography, material imagery, and restrained microinteraction.
- [Finely Crafted](https://www.awwwards.com/sites/finely-crafted), Awwwards Site of the Day: build a spatial story from craft, close material studies, and an intentional tour sequence.
- [Self Aware](https://www.awwwards.com/sites/self-aware), Awwwards Site of the Day: prove that a limited palette and original interaction can carry a complete experience.
- [Die Finnhütte](https://www.cssdesignawards.com/sites/die-finnhutte-modern-architecture/36193/), CSS Design Awards recognition: let large architectural photography and clean typography carry the page.

## Anti-Slop Standard

The following are rejection conditions for either site:

- Purple or cyan gradient washes used as atmosphere.
- Glassmorphism, floating translucent cards, glowing orbs, or random blurred blobs.
- Generated lettering, logos, labels, diagrams, or interface text inside footage.
- Generic futuristic slogans, vague luxury language, or copy that could describe any product.
- Impossible materials, weightless mechanical assemblies, excessive bloom, or plastic-looking surfaces.
- Fake live data, fake dashboards, false freshness, or controls that do nothing useful.
- Constant animation with no narrative or interaction purpose.
- Excessive rounded cards, pill-shaped decoration, or template-like section stacks.
- Reusing the ONDE HALO visual language, copper-on-black palette, floating-object composition, or Bodoni-style luxury treatment.

Every generated clip must pass a frame review for geometry, material behavior, temporal continuity, unwanted text, and physical plausibility before it enters the site.

## Shared Experience Architecture

Each experience is a standalone static web surface with focused files:

- `demo/vessel-zero/index.html`
- `demo/vessel-zero/site.css`
- `demo/vessel-zero/site.js`
- `demo/vessel-zero/media/`
- `demo/solaire-01/index.html`
- `demo/solaire-01/site.css`
- `demo/solaire-01/site.js`
- `demo/solaire-01/media/`

Each site contains six narrative chapters and one functional interactive tool. Shared utilities may be extracted only when both sites genuinely need identical behavior. Their art direction, layout, copy, motion curves, and interaction model remain independent.

The existing homepage will receive one clearly labeled portal card for each concept only after both isolated experiences pass verification. The cards must remain separate from real engagement proof.

## Seedance Production Workflow

Higgsfield Plus is active with 1,210 credits at design time. Seedance 2.0 is available through the signed-in Higgsfield web generator but is not exposed in the connected MCP model catalog. The Mac's Chrome session is the supported generation surface.

Each site receives three intentional Seedance clips:

- 8 seconds
- 16:9
- 1080p
- high bitrate
- silent generation unless a specific ambient source proves essential
- no embedded copy, logos, symbols, numbers, or interface graphics

The first useful generation is reviewed before producing the remaining five clips. A failed generation is revised by changing one prompt variable at a time. Credits are not spent on broad batches of speculative variations.

All prompt briefs use the same production structure:

1. Subject and physical environment.
2. Exact camera position and movement.
3. Action timed across the clip.
4. Material, lighting, lens, frame-rate, and grade.
5. Explicit exclusions for text, logos, fantasy geometry, distortion, and excess effects.

Downloaded final media is stored locally, optimized for the web, and referenced with poster images. The shipped website does not depend on temporary Higgsfield URLs.

## VESSEL ZERO

### Brand and visual system

VESSEL ZERO feels like an expedition record produced by a serious oceanographic institution.

- Abyss: `#061018`
- Cold steel: `#6B858C`
- Instrument white: `#E8ECE9`
- Safety orange: `#E45C2A`, reserved for critical controls and active states
- Primary typography: IBM Plex Sans
- Instrument typography: IBM Plex Mono

The composition uses hard rules, numbered chapters, coordinates, depth readings, and restrained instrument markings. It avoids neon science-fiction styling. Bioluminescence appears as sparse, physically plausible blue-green life against black water, not as a full-screen glow effect.

### Narrative chapters

1. **Surface / Deployment**: The submersible hangs above black water at first light. The title establishes the mission and the fictional-concept label.
2. **Thermocline / Descent**: Scroll moves through depth bands while pressure and temperature labels change using a clearly identified concept mission dataset.
3. **Hull / Sensing**: A macro material study explains sonar, optical, and water-sampling hardware.
4. **Array / Deployment**: The vehicle deploys a mechanically plausible sensor arm. No floating exploded assembly is used.
5. **Abyss / Encounter**: Sparse bioluminescent organisms emerge around the stationary vehicle while the page explains low-light observation.
6. **Mission Planner**: The visitor configures a simulated dive and receives a deterministic mission summary.

### Seedance shot briefs

#### VZ-01, deployment hero

A documentary-grade autonomous research submersible hangs from a real oceanographic vessel's A-frame above nearly black open water before dawn. Begin wide and low at water level, then make one slow stabilized push toward the suspended vehicle as cables take tension and small droplets fall from the matte pressure hull. Cold overcast sky, dark steel, salt residue, physically accurate scale, 40mm lens, restrained contrast, natural motion, 24fps. No people in close view, no text, no logos, no glowing trim, no fantasy machinery, no lens-flare wash, no warped cables.

#### VZ-02, sensor hull macro

Single continuous macro tracking shot across the side of an autonomous deep-sea submersible at depth. The camera glides slowly past riveted matte titanium, a pressure-rated optical dome, compact sonar apertures, water-sampling ports, and restrained status hardware while fine suspended particles cross the beam. One articulated sensor arm unfolds through a believable hydraulic sequence near the end. Deep black water, narrow neutral work light, subtle blue-green falloff, 65mm macro lens, documentary engineering film, 24fps. No words, labels, logos, neon, sparks, floating components, excessive bloom, or changing geometry.

#### VZ-03, abyss encounter

Wide locked-off deep-ocean composition with the submersible hovering several meters above a real sediment plain. Its work lights reveal a small field of translucent deep-sea organisms that drift gradually into view, with sparse blue-green bioluminescent pulses and a faint sediment current. The vehicle remains heavy and stable while the camera performs an almost imperceptible lateral drift. Scientifically plausible scale, black negative space, natural particle motion, quiet documentary grade, 35mm lens, 24fps. No monster imagery, no coral fantasy city, no saturated neon, no text, no logo, no rapid movement, no impossible light sources.

### Mission planner interaction

The planner offers three routes, a target depth, and an observation priority. It calculates a simulated mission duration, energy allocation, and equipment package from transparent local rules. Results update immediately, can be reset, and can be copied as a plain-text concept mission brief.

The tool is labeled **Concept mission simulation**. It does not claim live ocean conditions, real vehicle capability, or operational safety guidance.

## SOLAIRE / 01

### Brand and visual system

SOLAIRE / 01 feels like an architectural monograph that becomes a timepiece.

- Limestone: `#D8C8A8`
- Basalt: `#25221E`
- Iron oxide: `#A65332`
- Astronomical navy: `#18243A`
- Paper: `#ECE7DC`
- Display typography: Source Serif 4
- Interface typography: Source Sans 3

The visual system relies on material texture, precise grids, long horizontal rules, elevation-like annotations, and shadow. It avoids generic gold luxury styling. Brass appears only where a real mechanism calls for it.

### Narrative chapters

1. **Dawn / Approach**: The observatory stands in an empty desert as the first shadow defines its geometry.
2. **Solar Axis / Tracking**: A measured scroll sequence shows how the building aligns with the sun.
3. **Aperture / Opening**: The roof opens through a believable mechanical sequence at blue hour.
4. **Material / Instrument**: Macro studies of limestone, oxidized metal, glass, and optical hardware establish craft.
5. **Night / Alignment**: The interior telescope rotates into position while the sky becomes the dominant field.
6. **Observation Planner**: The visitor selects a date, program, and session length to produce a clearly labeled concept schedule.

### Seedance shot briefs

#### SO-01, dawn approach

Single continuous architectural film shot of a low desert observatory built from pale local limestone and dark oxidized steel. Begin with a wide static horizon just before sunrise, then make a slow precise dolly toward the structure as the sun clears a distant ridge and one long hard shadow travels across the entry wall. Dry high-desert atmosphere, restrained mineral palette, real stone texture, 32mm tilt-shift character, natural exposure, 24fps. No people, text, logos, glossy gold, curved fantasy towers, impossible reflections, pastel sky gradients, or exaggerated lens flare.

#### SO-02, roof mechanism

Blue-hour architectural close study of a real observatory roof aperture opening. The camera holds a three-quarter view while two heavy oxidized-steel roof sections separate on visible tracks at a slow engineered pace, exposing a dark interior and the first stars. Limestone walls remain fixed and geometrically consistent; small service lights are warm and practical. Precise mechanical weight, 50mm lens, cool ambient sky with warm interior contrast, 24fps. No floating pieces, morphing architecture, sparks, text, logos, excessive glow, or time-lapse clouds.

#### SO-03, telescope alignment

Interior night shot inside a restrained contemporary observatory. A large but plausible research telescope rotates slowly on its mount beneath the open roof while the camera makes a controlled semicircular dolly around the instrument. Moonless deep-navy sky, crisp stars without fantasy nebulae, matte black mechanics, aged brass adjustment hardware used sparingly, pale stone floor, quiet museum-grade lighting, 40mm lens, 24fps. No people, text, logos, holograms, glowing interfaces, impossible star motion, or changing telescope geometry.

### Observation planner interaction

The planner accepts a local date, observation program, and session length. It produces a deterministic concept schedule with setup, calibration, observing, and close-down blocks. A simple daylight indicator is calculated from the selected time and the fictional site's fixed latitude.

The tool is labeled **Concept observation schedule**. It does not claim live weather, real target visibility, or professional astronomical guidance.

## Motion and Layering

Motion is episodic, not constant. Each scene has one dominant movement and at most one secondary ambient layer.

- Video is the base layer for three major moments per site.
- HTML typography stays crisp above media and never becomes part of generated footage.
- Canvas is limited to low-cost particles, depth marks, stars, or shadow calculations that add information or atmosphere.
- Pointer parallax is subtle, capped, and disabled on touch devices.
- Scroll choreography is mapped through `requestAnimationFrame` and normalized progress values.
- Intersection observers suspend offscreen media and animation work.
- Canvas device-pixel ratio is capped to protect mobile performance.
- No scroll hijacking or custom inertial scrolling is used.
- Reduced-motion mode removes scrubbing, parallax, pulsing, and automatic spatial movement while retaining content and controls.

Sound is optional and off by default. If used, it is a coded or licensed ambient field controlled by one explicit button. Video comprehension cannot depend on audio.

## Responsive Behavior

Desktop uses the full cinematic sequence. Mobile is a deliberately recomposed experience, not a scaled desktop.

- Copy becomes a single readable column.
- Full-width videos use mobile-safe crops and poster fallbacks.
- Scroll-scrubbed video may become short autoplay loops when scrubbing would be unreliable.
- Dense coordinate and architectural annotations collapse into compact labeled rows.
- Interactive controls remain at least 44 pixels high and support touch without hover.
- Decorative canvas density is reduced.
- No horizontal overflow is allowed at 390 pixels.

## Media Failure and Error Handling

- Every video has a tested poster image and useful fallback composition.
- Failed or blocked video playback leaves all text and interactions available.
- JavaScript failure preserves a coherent linear document.
- Interactive inputs validate ranges inline without modal alerts.
- Copy and reset actions expose visible status messages through accessible live regions.
- No error state suggests that concept data is live or connected to an external system.

## Verification Plan

### Automated checks

- Contract tests for required sections, concept labels, controls, metadata, fallback media, and internal links.
- Unit tests for mission-planner and observation-planner calculations.
- Tests for reset, copy-status, reduced-motion branches, and missing-video fallback classes.
- Existing Mote Ops site tests remain green.
- Static link and asset-reference validation.

### Browser checks

- Desktop review at a modern 1440-pixel viewport.
- Mobile review at 390 pixels.
- Keyboard-only navigation.
- Touch-sized controls and no hover-only information.
- Reduced-motion review.
- Video blocked or unavailable review.
- No horizontal overflow.
- No console warnings or errors.
- All visible buttons and controls perform the action they imply.

### Performance checks

- Optimized video sizes are recorded before integration.
- Hero poster appears before video readiness.
- Offscreen video and canvas work stops.
- Interaction remains responsive during scroll.
- The mobile version avoids simultaneous playback of multiple clips.

## Delivery Boundary

Implementation, media generation, and validation occur locally first. Each concept may receive a separate review deployment after it passes verification. The live `moteops.tech` homepage and public showcase links change only after Mike gives explicit publish approval in the same session.

## Acceptance Checklist

Before either site is called complete:

- All six Seedance clips have passed frame review and local optimization.
- The anti-slop rejection list has been applied to every scene.
- The two sites are visually and structurally distinct.
- Both interactive tools work and are truthfully labeled.
- Desktop, mobile, keyboard, reduced-motion, and fallback paths pass.
- Existing site tests remain green.
- The homepage portal is added only after isolated verification.
- No deployment or public-site change occurs without explicit approval.
