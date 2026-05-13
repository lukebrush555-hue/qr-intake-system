# RopeBridge Current Status

_Last updated: 2026-05-13_

## Project Identity

RopeBridge is reusable infrastructure for physical-to-digital interactions.

The operating model is:

```txt
physical encounter
→ QR scan
→ lightweight identity handshake
→ vendor-specific interaction
→ persistent relationship continuity
```

The core philosophy remains **bones + config**:

- reusable structures over one-off pages
- campaign/vendor differences expressed through config and assets
- mobile-first and QR-first
- friction once
- recognition continuity
- browser remains untrusted
- implementation simplicity over premature abstraction

RopeBridge should not become a generic SaaS dashboard, CMS, ecommerce app, or pile of unrelated landing pages.

Current archetype focus: **SamplePass**.

---

## Current Repository / Deployment

Repository:

```txt
lukebrush555-hue/qr-intake-system
```

GitHub Pages test route:

```txt
https://lukebrush555-hue.github.io/qr-intake-system/templates/samplepass-v1/
```

Current primary working route:

```txt
templates/samplepass-v1/
```

Legacy/original route preserved:

```txt
templates/samplepass-claim/
```

Important browser gotcha discovered:

- Chrome Android “Desktop site” mode makes the mobile page appear tiny.
- If mobile rendering looks shrunken in Chrome but correct in Firefox, check Chrome menu → Desktop site and turn it off.
- This was not a CSS/layout failure after the later fixes.

---

## Current Implementation State

The earlier `design-system-v1` branch / PR was merged into `main`.

`templates/samplepass-v1/` now exists on `main` as the active design-system test route.

Recent high-level changes made on `main`:

- added shared RopeBridge CSS design-system files
- added SamplePass v1 route
- added localStorage recognition flow
- fixed mobile layout by removing fragile viewport/grid centering behavior
- forced cream/olive/brass palette instead of respecting device dark mode
- simplified active SamplePass visual hierarchy
- removed top vendor text from the active interact screen
- removed `SAMPLEPASS` eyebrow from the active offer card
- removed `powered by RopeBridge` text from the active flow
- centered the seal/logo as the only brand mark above the recognition message
- added `assets/images/ropebridge-seal.svg` as a repo-native seal asset
- reworked `Welcome back, Luke.` into a quiet recognition card

Most recent test URL used:

```txt
https://lukebrush555-hue.github.io/qr-intake-system/templates/samplepass-v1/?v=seal-recognition-1
```

---

## Current File Structure of Interest

Shared design-system CSS:

```txt
assets/css/ropebridge/tokens.css
assets/css/ropebridge/base.css
assets/css/ropebridge/components.css
assets/css/ropebridge/states.css
```

SamplePass v1 route:

```txt
templates/samplepass-v1/index.html
templates/samplepass-v1/app.js
```

SamplePass v1 config:

```txt
configs/samplepass-design-system-v1.js
```

Assets:

```txt
assets/images/samplepass-stand.jpg
assets/images/ropebridge-seal.svg
```

Legacy route still present:

```txt
templates/samplepass-claim/index.html
templates/samplepass-claim/app.js
templates/samplepass-claim/styles.css
configs/samplepass-demo.js
```

---

## Current Visual Direction

The approved direction is **cream + olive + brass**, based on the user’s reference mockup.

The page should feel like:

```txt
premium artisan product experience
boutique packaging
quiet heritage object
physical-world QR interaction
```

Not:

```txt
dark-mode SaaS
generic web app
startup dashboard
QR tool UI
```

Key color direction:

- cream paper background
- deep olive primary CTA / seal
- brass accent text or dividers
- charcoal-green text
- soft shadows
- tactile card surfaces

Important correction:

- Do **not** reintroduce device-driven dark mode for this active SamplePass v1 visual route.
- The user specifically rejected the dark green/dark-mode appearance because it did not match the cream/olive reference.

---

## Current Active Interact Screen Hierarchy

The approved active order is:

```txt
centered seal/logo
Welcome back, Luke.
image
Wildflower Raw Honey
description
Claim sample
limit note
```

Removed from the active interact screen:

```txt
Backyard Blooms top text
Raw Honey top subtitle
SAMPLEPASS eyebrow
powered by RopeBridge text
```

Reasoning:

- the logo/seal is enough as the brand/system mark
- vendor/product context should come from the offer itself
- avoid duplicating “Honey” in multiple places
- reduce clutter and make the experience feel premium

Current limitation:

- `assets/images/ropebridge-seal.svg` is a scalable repo-native approximation of the uploaded olive seal.
- The exact uploaded PNG/photo asset has not yet been committed as a binary repo asset.
- Next improvement could be replacing or supplementing the SVG with the exact approved olive seal image if needed.

---

## Recognition UX Direction

Recognition is foundational.

Every scan should ask:

```txt
Have I seen this person before?
```

Current lightweight recognition uses localStorage:

```txt
ropebridge-connected
ropebridge-name
ropebridge-phone
```

Current visual treatment:

- centered seal/logo first
- quiet recognition card below it
- message: `Welcome back, Luke.` when remembered

Next visual exploration:

- make the recognition card feel less like a status alert and more like a soft personal continuation cue
- possible wording directions:
  - `Welcome back, Luke.`
  - `Good to see you again, Luke.`
  - `You’re already connected.`
  - `Ready when you are, Luke.`

Avoid punitive/redeem-like language such as:

```txt
Already claimed
One claim used
Error / duplicate
```

---

## Product Flow

RopeBridge still follows the 3-state model:

1. **Connect** — lightweight identity handshake
2. **Interact** — vendor-specific action
3. **Connected** — persistent relationship continuity

### State 1 — Connect

Purpose:

- phone-first recognition setup
- minimal capture
- trust establishment

Current implementation:

- first name
- phone
- consent checkboxes
- localStorage save
- then move to Interact state

### State 2 — Interact

Purpose:

- vendor/product action
- current action: claim sample

Current implementation:

- remembered visitor skips Connect and lands here
- welcome recognition appears when remembered
- submit inserts lead into Supabase

### State 3 — Connected

Purpose:

- relationship continuity, not a dead-end redemption screen
- useful onward links

Current implementation:

- connected state exists
- social/order links exist in markup/config
- needs further visual refinement after interact screen is stabilized

---

## Supabase Integration

Current primary table:

```txt
public.lead_requests
```

Browser behavior:

- direct `POST /rest/v1/lead_requests`
- publishable key only
- insert-only browser posture
- no browser-side read/update/delete expected

RLS assumptions:

- RLS enabled
- anonymous insert allowed
- service role remains server/trusted only
- no service_role key in frontend

Current payload includes:

- project type
- template id
- source id
- QR id
- visitor name/phone
- business name
- metadata including product/category/remembered/design-system marker

---

## Current UX Rules to Preserve

Preserve unless explicitly changed:

- QR-first
- mobile-first
- friction once
- recognition continuity
- calm premium artisan feeling
- text-first vendor identity
- do not require vendor logos
- do not require professional photography
- no heavy auth
- no dashboard unless operationally necessary
- no generic SaaS styling
- no dark-mode override for the current cream/olive SamplePass v1 direction
- no `powered by` text in the active flow unless the user re-asks for it
- seal/logo can carry the RopeBridge identity without extra explanatory text

---

## Known Risks / Technical Debt

- localStorage recognition is useful for UX prototyping but not durable across devices.
- no durable `users` / `interactions` tables yet.
- no shared config loader yet; config is still global-variable based.
- no visual regression tests.
- no formal asset pipeline.
- current seal SVG is an approximation of the uploaded olive wax seal.
- GitHub Pages / Chrome may cache CSS aggressively; use query cache busters when testing.
- Chrome Android Desktop Site mode can mislead testing by shrinking the page.

---

## Recommended Next Step

Continue from the active SamplePass v1 route:

```txt
templates/samplepass-v1/
```

Immediate next work:

1. Review the actual seal rendering on mobile.
2. Decide whether to replace the SVG approximation with the exact uploaded olive seal image.
3. Reimagine the `Welcome back, Luke.` visual treatment.
4. Continue pushing the page toward the cream/olive reference mockup.
5. After Interact state is approved, apply the same visual language to Connect and Connected states.

Do not revert to the dark app look.
Do not re-add top vendor text, `SAMPLEPASS`, or `powered by RopeBridge` to the active interact state unless explicitly requested.

---

## Quick Start Context for Future AI Sessions

Start by reading this file, then inspect:

```txt
templates/samplepass-v1/index.html
assets/css/ropebridge/tokens.css
assets/css/ropebridge/base.css
assets/css/ropebridge/components.css
assets/css/ropebridge/states.css
templates/samplepass-v1/app.js
configs/samplepass-design-system-v1.js
```

The current direction is not “build a website.”

The current direction is:

```txt
turn a physical QR scan into a premium, remembered, vendor-specific interaction
```

RopeBridge should make new QR experiences cheap to create without making the repo feel like a pile of unrelated landing pages.

Keep the bones reusable, keep the config explicit, keep the browser untrusted, and keep the experience quiet, physical, and premium.
