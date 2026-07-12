# Mote Ops Private AI Workbench — Website Design Specification

## Objective

Reframe Mote Ops as the installer of private, supervised AI systems for small businesses. The site must make the larger offer understandable in one scroll: Mote Ops connects the tools a business already uses to private models, operating context, rules, human approvals, and useful owner-facing outputs.

The page must prove the concept with interactive, synthetic demonstrations grounded in systems Mike has actually built. It must not imply autonomous operation, continuous uptime, measured customer results, or production readiness where those claims have not been verified.

## Primary Message

Headline direction: **We build private AI systems around the way your business already works.**

Supporting promise: Mote Ops can connect a business's phone, email, files, policies, and existing software to a supervised operating layer that organizes work, drafts next actions, keeps context available, and puts consequential decisions in front of a person.

Avoid leading with the unexplained acronym “AIOS.” Introduce it only after the plain-language promise as shorthand for a private AI operating system.

## Audience

The page speaks to owner-led small businesses whose operational knowledge is fragmented across people and tools, especially:

- Learning centers and childcare operators managing inquiries, tours, forms, family communication, and placement.
- Home-service businesses handling after-hours leads, quoting, scheduling, and follow-up.
- Appointment-based professional teams coordinating intake, documents, customer communication, and next actions.

The page should allow visitors to recognize a problem pattern without implying that one packaged workflow fits every business.

## Creative Direction: The Operator's Workbench

The interface should feel assembled by a capable operator, not generated from a SaaS landing-page template.

### Palette

- Warm bone paper: primary reading surface.
- Soot black: navigation, technical plates, and high-contrast sections.
- Deep forest green: system core and verified/operational states.
- Oxidized copper: connectors, hardware details, and secondary emphasis.
- Safety orange/vermilion: actions, warnings, annotations, and stamped labels.
- Muted brass or chartreuse may appear sparingly for instrument readings.

Blue, indigo, purple, cyan, and aqua are excluded from the design system.

### Visual Grammar

- Use asymmetrical editorial compositions, margin notes, ledger rules, numbered equipment plates, wiring paths, stamps, and evidence-log annotations.
- Use square or lightly softened corners. Repeated large rounded-card grids are prohibited.
- Interactive controls may resemble physical toggles, rotary selectors, punched tabs, or labeled switches when their operation remains accessible and obvious.
- Diagrams should resemble service manuals and control panels, but text must remain clean and readable.
- Texture should be subtle: paper grain, ink variation, and restrained metal surfaces. It must not reduce contrast or make the experience feel like a themed novelty site.
- Motion should communicate routing and state changes. Avoid ambient glow, floating particles, decorative parallax, and animation without information value.

### Explicitly Avoid

- Blue or purple gradients.
- Glassmorphism.
- Glowing orbs and futuristic AI brains.
- Uniform grids of interchangeable rounded cards.
- Generic outline-icon libraries as the dominant visual language.
- Oversized centered slogans repeated between sections.
- Fake terminals that do not accept input or controls that do not change a real demo state.

## Page Structure

### 1. Hero: The Workbench Promise

Lead with the primary message and a short explanation of the business outcome. The visual is an assembled system plate rather than a decorative illustration:

`Phone + Email + Files + Existing tools → Private AI system → Owner brief + Control center + Voice operator`

The hero should identify three trust boundaries immediately: runs around existing tools, supports local/private models where appropriate, and keeps people responsible for consequential actions.

Primary call to action: explore the system. Secondary call to action: book a fit call.

### 2. Interactive Private AIOS System Map

Build a large interactive wiring diagram with five bounded layers:

1. **Inputs:** phone, email, files, calendar, and line-of-business tools.
2. **Context:** business documents, current project state, policies, and operating memory.
3. **Intelligence:** local LLM or selected cloud model, chosen according to the task and privacy requirements.
4. **Control:** deterministic rules, permissions, audit log, and human approval boundaries.
5. **Outputs:** owner brief, customer draft, control center, voice/phone response, or project handoff.

Visitors select a sample request such as “What needs my attention today?” The diagram visibly routes it through the layers, opens an evidence drawer at each step, and ends at an owner-reviewed output. Every interaction runs entirely in the browser with synthetic data.

The system map must distinguish:

- **Verified on Mike's Mac:** Ollama runtime with `qwen3-coder:30b` and `qwen3:14b`; local operating context and bridge artifacts; working Voice OS components and phone-access patterns; tested project/status routing; CC's Care Hub build.
- **Demonstrated publicly:** synthetic routing, sample local-model response, example approval, and sample control-center records.
- **Configured per client:** integrations, permissions, retention, local-versus-cloud model choice, and live business data.

### 3. Systems Mote Ops Can Install

Present capabilities as numbered equipment plates, not ecommerce product cards:

1. **Private AI Control Center** — one place to see work, status, approvals, and exceptions.
2. **Local LLM Workstation** — models running on business-owned hardware for appropriate private tasks.
3. **Phone and Voice Operator** — secure access to ask questions, capture information, request status, and initiate bounded actions.
4. **Operational Memory** — canonical documents, project context, decisions, and handoffs that survive across sessions and tools.
5. **Supervised Customer Workflow** — intake, classification, drafting, routing, follow-up, and explicit approval.
6. **Client Workspace** — a focused operational interface such as CC's Care Hub.

Each plate includes: the business problem, what is installed, what remains human-owned, and the evidence available today.

### 4. A Day With the Operator

Use a horizontal timeline on desktop and a vertical ledger on mobile:

- 7:00 AM: owner brief summarizes priorities and exceptions.
- 10:15 AM: owner asks from the phone for current project or customer status.
- 1:30 PM: local model reviews private files for a bounded task.
- 4:45 PM: owner approves customer follow-ups and records the decisions.

This is an illustrative composite, not a claim that every event currently runs unattended.

### 5. Existing Working Demonstrations

Retain and visually rebuild both existing demos within the workbench language:

- Supervised after-hours lead workflow.
- CC's Care Hub enrollment workflow using fictional family records.

Do not duplicate their full explanations above the fold. The system map explains the common architecture; these demonstrations prove how it changes for two different businesses.

The real CC's Control Center remains protected. The public demo links to it only as owner access requiring sign-in.

### 6. Engagement and Commercial Path

Keep the existing evidence-first ladder:

- $1,000 Workflow Audit.
- $1,500–$2,500 Micro-Sprint.
- $4,000–$6,000 Full Installation.
- Optional $750/month 90-Day Support.

Explain that system composition depends on the audit. Do not sell the entire AIOS as a universal package or imply every small business needs a local model.

### 7. Proof and Operator Accountability

Show Mike as the accountable builder. The proof section should separate:

- Systems that technically work.
- Client workflows currently being validated.
- Measured business outcomes that do not exist yet.

Keep the “leave it alone” verdict and limited monthly capacity as trust signals.

## Interaction Model

- The AIOS diagram is the primary new interaction.
- Inputs, routing layers, and outputs are keyboard navigable.
- A visible status/evidence log announces what changed and whether an action is synthetic, local-only, awaiting approval, or complete.
- Local-model demonstrations use prerecorded synthetic responses; the public site never calls Mike's Mac or exposes a local service.
- Existing lead and Care Hub controls continue to work locally in the browser and never imply a real message or record was changed.
- All links and controls perform the action their labels promise.

## Mobile Design

The phone experience is a first-class composition, not a compressed desktop diagram.

- Convert the wide wiring diagram into a vertical signal path.
- Keep one active layer expanded at a time.
- Use sticky, compact state controls only while a demo is active.
- Ensure tap targets are at least 44 by 44 CSS pixels.
- Preserve the annotated workbench character without placing handwritten notes behind essential copy.
- The provided Mote Ops Operator phone screenshot may appear inside an evidence plate with a caption explaining exactly what it proves and does not prove.

## Accessibility and Performance

- Maintain WCAG AA contrast for essential text and controls.
- Provide semantic headings, landmarks, tabs, and live regions.
- Respect reduced-motion preferences by replacing animated routing with immediate state transitions.
- Avoid large video or canvas dependencies. Build the system diagram with semantic HTML and CSS, using small inline SVG only for wiring paths when necessary.
- The page must remain useful with JavaScript disabled: the complete architecture and evidence labels remain readable even when the demos cannot change state.

## Verification Requirements

Automated contract tests must verify:

- The primary message and all five system layers are present.
- The local-model names are accurate and labeled as Mike's current test installation, not universal client requirements.
- The phone operator and AIOS claims match verified local evidence.
- The public site contains no live local endpoints, secrets, private records, or claims of unattended autonomy.
- The workbench palette excludes blue-family production colors.
- All interactive system-map controls have real state-change behavior and accessible announcements.
- Both existing demonstrations remain functional.
- The protected CC's link remains labeled as owner access requiring sign-in.
- Pricing, contact links, reduced motion, and responsive behavior remain intact.

Manual verification must cover desktop and mobile layouts, keyboard operation, visible focus, reduced motion, each diagram route, every button, and all external links.

## Success Criteria

A first-time visitor should understand within 30 seconds:

1. Mote Ops installs private, supervised AI systems around existing business tools.
2. A system may combine local models, operating context, phone access, control centers, and workflow automation.
3. Humans retain control of consequential actions.
4. The public examples are interactive but synthetic.
5. The next step is a bounded workflow audit, not a commitment to a large platform build.

The finished site should be visually recognizable as Mote Ops without relying on its logo: tactile, evidence-labeled, operational, and unlike a generic AI-generated SaaS landing page.
