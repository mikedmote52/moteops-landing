# Mote Ops Demo-First Workbench — Design Specification

## Objective

Make the Mote Ops offer understandable by letting visitors use concrete examples before explaining the infrastructure. The current five-layer architecture diagram is technically accurate but visually reads like documentation. The redesign must lead with working, browser-local demonstrations and move architecture/evidence into supporting disclosure.

## Primary Message

Headline: **Try the systems we build.**

Supporting copy: Mote Ops builds private, supervised AI systems for the repetitive work between a small business's phone, email, files, policies, and existing software. Choose a real example below and operate it yourself.

## Demo Gallery

The first major section is a four-demo selector. Each selection opens one complete interactive workspace in the same position rather than scrolling to disconnected cards.

### Demo 1 — Mote Ops Operator

Show a phone-shaped operator interface based on Mike's actual phone surface. Visitors can choose one of three synthetic prompts:

- “What needs my attention today?”
- “Continue the CC's Care Hub project.”
- “Review these files privately.”

The demo displays the request, attached operating context, chosen route, bounded result, and whether approval is required. It proves phone access, project/status routing, operating context, and human control. It does not connect to Mike's phone, Mac, or a live voice service.

### Demo 2 — Private Local-Model Review

Show a preloaded fictional document set for a small business. Visitors select one bounded review task, run the sample, and receive source-cited findings. The interface names Mike's current Ollama models as verified evidence, but labels the response as prerecorded synthetic output. No visitor upload and no call to Mike's local runtime.

### Demo 3 — Supervised Lead System

Reuse the complete Dana HVAC demonstration: original voicemail, missing details, draft editing, owner approval, skip, reasoning, and reset. Preserve all current working controls.

### Demo 4 — CC's Care Hub

Reuse the complete public enrollment workspace: pipeline, tours, required forms, placement, local task toggles, and fictional family records. Keep the protected real Control Center link labeled `Owner access — sign-in required`.

## Interaction Rules

- The gallery selector uses complete, accessible tab/tabpanel semantics and arrow/Home/End keyboard navigation.
- Only the selected demo workspace is visible.
- Every demo begins with one sentence answering “What does this prove?”
- Every demo shows a persistent state badge: `Working pattern`, `Synthetic public data`, and `No live connection` where applicable.
- All visible controls change local state. No decorative fake buttons.
- Switching demos preserves no sensitive state and may safely reset the newly selected demo.
- The sticky booking action remains hidden while any demo workspace is in view.

## Architecture After the Demos

Replace the dominant architecture console with a compact `<details>` section titled `How Mote Ops builds these systems`.

Inside, keep the five layers—Inputs, Context, Intelligence, Control, Outputs—but use one concise line per layer. Follow with a three-column evidence ledger:

- **Working on Mike's Mac:** current Ollama installation, canonical operating context/bridge artifacts, working Voice OS components and phone-access patterns, tested project/status routing, and CC's Care Hub build.
- **Simulated on this public site:** browser-only sample requests, prerecorded local-model output, fictional business records, and local approval state.
- **Configured per client:** integrations, permissions, retention, model choice, hardware, and live business data.

The architecture section must not contain action buttons or compete visually with the demo gallery.

## Page Order

1. Demo-first hero.
2. Interactive demo gallery.
3. Compact architecture and evidence disclosure.
4. Six installable-system equipment plates.
5. Operator-day timeline.
6. Friction calculator and problem patterns.
7. Engagement pricing.
8. Proof, fit, Mike, FAQ, and closing call to action.

## Visual Direction

Retain the approved Operator's Workbench system:

- Bone paper, soot, forest, copper, signal orange, and brass.
- No blue-family colors, gradients, glassmorphism, glowing AI imagery, or generic rounded SaaS cards.
- Demonstrations resemble purpose-built operating surfaces, not one repeated dashboard template.
- Operator phone: focused communication console.
- Local model: document bench with source ledger.
- Lead system: supervised dispatch board.
- Care Hub: enrollment operations workspace.

## Mobile

- The demo selector scrolls horizontally with clear selected state.
- Each demo is a single-column composition designed for 375–430px widths.
- The phone demo uses the width of the screen without placing a miniature unreadable phone inside it.
- The architecture disclosure stays collapsed by default.
- No sticky CTA may cover a demo control.

## Evidence and Safety Boundaries

- Never call private/local endpoints or expose tokens, logs, paths, or client data.
- Never describe synthetic outputs as live inference.
- Never imply the complete Voice OS is continuously operational; use `working Voice OS components and phone-access patterns`.
- CC's family names and all other public records remain fictional.
- Consequential actions remain explicitly human-approved.

## Verification

Automated tests must cover:

- Demo-first headline and gallery order.
- Four accessible gallery tabs connected to one changing panel.
- Real local state changes for phone prompts, local-model tasks, lead controls, and Care Hub controls.
- Persistent synthetic/no-live labels within each demo.
- Architecture appears after the demo gallery and is collapsed via `<details>`.
- Existing privacy, palette, pricing, proof, links, reduced motion, and mirror contracts remain green.

Manual verification must cover desktop and mobile layout, all four demo paths, keyboard gallery switching, sticky CTA suppression, visual differentiation between workspaces, and zero console errors.

## Success Criteria

Within 20 seconds, a first-time visitor can:

1. Say what Mote Ops builds.
2. Choose and operate a relevant example.
3. See the human-approval boundary.
4. Distinguish a working pattern from live customer data.
5. Understand that the audit selects the right system rather than selling every component to everyone.
