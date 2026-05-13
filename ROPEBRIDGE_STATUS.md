# RopeBridge Current Status

_Last updated: 2026-05-13_

## Project Identity

RopeBridge is currently represented in this repository as `qr-intake-system`: a reusable, QR-driven intake foundation for turning small physical-world prompts into simple digital landing pages.

The core philosophy is **bones + config**: the template is the reusable product surface, while each campaign/vendor/page should mostly be expressed as configuration and assets. The browser-facing experience should stay small, mobile-first, QR-first, and security-conscious.

RopeBridge is not a generic SaaS dashboard, CMS, ecommerce app, or pile of unrelated landing pages. It is infrastructure for physical-to-digital interactions:

```txt
physical encounter
→ QR scan
→ lightweight identity handshake
→ vendor-specific interaction
→ persistent relationship continuity
```

The current archetype focus is **SamplePass**.

---

## Current Safe Work Branch

A non-destructive design-system implementation is currently in progress on:

```txt
design-system-v1
```

Draft PR:

```txt
https://github.com/lukebrush555-hue/qr-intake-system/pull/2
```

PR title:

```txt
Add RopeBridge design system v1 as parallel SamplePass route
```

Important: this branch was intentionally created as a **parallel layer**, not a replacement. The original SamplePass route and config remain untouched.

---

## Current Architecture

- Frontend stack: plain static HTML, CSS, and JavaScript.
- No framework, bundler, package manager, or build step.
- Backend/services: Supabase PostgREST is used directly from browser JavaScript for insert-only lead capture.
- Deployment method: static hosting from the repository root, documented for GitHub Pages and Vercel.
- Browser remains untrusted.
- Supabase service-role keys must never be exposed in frontend code.
- RLS remains the core database safety boundary.

---

## Current Routes

### Existing/live route

```txt
templates/samplepass-claim/
```

This is the existing SamplePass implementation. Do not casually overwrite it.

### New opt-in design-system route

```txt
templates/samplepass-v1/
```

This route was added on the `design-system-v1` branch as a safe test lane for RopeBridge Design System v1.

Purpose:

- test the new design system without disturbing the original page
- create a reusable visual layer for future RopeBridge archetypes
- preserve the 3-state Connect → Interact → Connected product model

---

## Repository Structure

Key existing files:

- `README.md`: setup, deployment, Supabase, security, and testing instructions.
- `PROJECT_CONTEXT.md`: product philosophy and project boundaries.
- `AGENTS.md`: operating rules for future Codex/AI work.
- `ROPEBRIDGE_STATUS.md`: this new-chat handoff/status file.
- `.env.example`: local example values for `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.
- `configs/samplepass-demo.js`: existing SamplePass config.
- `templates/samplepass-claim/index.html`: existing SamplePass markup.
- `templates/samplepass-claim/app.js`: existing SamplePass behavior.
- `templates/samplepass-claim/styles.css`: existing SamplePass styling.
- `assets/images/samplepass-stand.jpg`: current offer image.
- `supabase/schema.sql`: current Supabase schema and RLS grants/policy.
- `supabase/migrations/202605060001_init_lead_requests.sql`: migration matching `schema.sql`.
- `.github/workflows/ci.yml`: minimal CI that validates JSON and checks JavaScript syntax.

New files added on `design-system-v1`:

```txt
assets/css/ropebridge/tokens.css
assets/css/ropebridge/base.css
assets/css/ropebridge/components.css
assets/css/ropebridge/states.css
configs/samplepass-design-system-v1.js
templates/samplepass-v1/index.html
templates/samplepass-v1/app.js
```

Safety status of the design-system branch:

```txt
7 new files
0 deletions
existing samplepass-claim route untouched
existing samplepass-demo config untouched
```

---

## Current Product Flow

The intended RopeBridge product language describes a 3-state flow:

1. **Connect**
2. **Interact**
3. **Connected**

### State 1 — Connect

Purpose:

- lightweight identity handshake
- trust establishment
- phone-first recognition setup

Default direction:

```txt
Sign in once. Easier every time.
```

State 1 should feel slightly more institutional/system-level than vendor-specific.

### State 2 — Interact

Purpose:

- vendor-specific action
- claim sample, save haircut, save preference, request info, etc.

State 2 should be vendor-first and action-first.

### State 3 — Connected

Purpose:

- relationship continuity
- useful next links
- not a dead-end redemption screen

State 3 should feel like:

```txt
You’re connected now.
```

not:

```txt
You already claimed this.
```

---

## Current Existing SamplePass Behavior

The existing `templates/samplepass-claim/` route currently implements a SamplePass flow with:

- brand/vendor header
- product/offer image
- offer copy
- lead/claim interaction
- localStorage-based remembered visitor behavior
- Supabase insert into `public.lead_requests`
- connected/thank-you state
- vendor social/order links

It loads:

```txt
../../configs/samplepass-demo.js
./app.js
./styles.css
```

Do not assume this route should be replaced by the design-system route until the user has visually approved it.

---

## New Design System v1 Implementation

The design-system branch adds a reusable RopeBridge CSS layer.

### CSS layers

```txt
assets/css/ropebridge/tokens.css
```

Defines:

- warm neutral palette
- rope/brass accent colors
- dark-mode equivalents
- spacing scale
- radius tokens
- shadow tokens
- motion tokens
- flow max width

```txt
assets/css/ropebridge/base.css
```

Defines:

- global box sizing
- body/page foundation
- mobile-first flow shell
- state visibility
- base typography helpers
- reduced-motion handling

```txt
assets/css/ropebridge/components.css
```

Defines:

- cards
- buttons
- inputs
- check rows
- image containers
- link rows
- status text
- powered-by mark
- vendor/system headers
- RB seal treatment

```txt
assets/css/ropebridge/states.css
```

Defines:

- Connect state styles
- Interact/offer state styles
- recognition banner
- Connected state styles
- useful link section

### New SamplePass v1 route

```txt
templates/samplepass-v1/
```

Loads:

```txt
../../assets/css/ropebridge/tokens.css
../../assets/css/ropebridge/base.css
../../assets/css/ropebridge/components.css
../../assets/css/ropebridge/states.css
../../configs/samplepass-design-system-v1.js
./app.js
```

### New SamplePass v1 config

```txt
configs/samplepass-design-system-v1.js
```

Uses:

```txt
window.SAMPLEPASS_DESIGN_SYSTEM_V1_CONFIG
```

This avoids mutating the existing `window.SAMPLEPASS_DEMO_CONFIG` path.

---

## Supabase Integration

Current primary table:

```txt
public.lead_requests
```

Current columns:

- `id uuid primary key default gen_random_uuid()`
- `created_at timestamptz default now()`
- `project_type text not null default 'generic'`
- `template_id text not null default 'hero-form'`
- `source_id text`
- `qr_id text`
- `name text`
- `phone text`
- `email text`
- `business_name text`
- `message text`
- `metadata jsonb not null default '{}'::jsonb`

Active browser behavior:

- Browser sends `POST /rest/v1/lead_requests`.
- Headers include `apikey`, `Authorization: Bearer <publishable key>`, `Content-Type: application/json`, and `Prefer: return=minimal`.
- Browser performs insert only.
- No browser-side read/update/delete query is expected.

RLS assumptions:

- RLS is enabled on `public.lead_requests`.
- Anonymous insert is allowed.
- Service role has full trusted access.
- Browser must remain insert-only and untrusted.

---

## Recognition Direction

Recognition continuity is a foundational RopeBridge principle.

Every scan should ask:

```txt
Have I seen this person before?
```

Current lightweight implementation uses localStorage keys:

```txt
ropebridge-connected
ropebridge-name
ropebridge-phone
```

Future durable direction:

```txt
users table
interactions table
localStorage identity pointer
```

Do not introduce heavy auth unless there is a clear product need.

---

## UI / UX Rules

Preserve these rules unless the user explicitly changes direction:

- Mobile-first: QR traffic likely starts on phones.
- QR-first: optimize for someone arriving from a physical scan/tap.
- Friction-once: ask only for what is needed at the moment of intent.
- Reusable templates: campaigns should usually be config plus assets.
- Bones + config: structure should remain reusable; identity should live in config.
- State 1 visually distinct from States 2/3.
- Text-first vendor headers.
- Do not require vendor logos.
- Do not require professional photography.
- Keep forms obvious, tappable, and forgiving.
- Avoid generic SaaS aesthetics.
- Avoid dashboards unless operational need proves it.
- Preserve local/community tone.
- Connected state is not a dead end.
- Vendor should be able to socially override friction.

---

## Design System Direction

RopeBridge Design System v1 should feel:

- calm
- grounded
- physical-world friendly
- quietly premium
- text-first
- warm-neutral
- reusable
- implementation-light

Avoid:

- glossy startup UI
- loud gradients
- overbuilt dashboards
- corporate marketing clutter
- unnecessary animation
- requiring polished vendor media

The default visual system is based on:

- warm paper backgrounds
- charcoal ink text
- muted rope/brass accent
- rounded tactile cards
- subtle shadows
- large mobile tap targets
- one primary CTA per screen

---

## Known Risks / Technical Debt

- `configs/samplepass-demo.js` contains concrete Supabase project values. They are publishable/browser-safe, but future contributors must not confuse this with permission to expose service-role keys.
- `.env.example` also contains concrete values rather than placeholders.
- Config shape is still global-variable based and template-specific.
- There is no shared config loader yet.
- There is no durable users/interactions schema yet.
- localStorage recognition is useful for UX prototyping but not durable across devices.
- RLS insert policy allows anonymous inserts, so spam protection and rate limiting remain future concerns.
- No browser/end-to-end visual regression tests exist.
- No formal design-token build pipeline exists; CSS tokens are hand-authored.

---

## Recommended Next Step

Before merging the draft PR, visually test:

```txt
templates/samplepass-v1/
```

Compare against:

```txt
templates/samplepass-claim/
```

Evaluate:

- Does State 1 feel trustworthy, not threatening?
- Does State 2 feel vendor-first and not SaaS-heavy?
- Does State 3 feel useful instead of dead-ended?
- Does the system still look good without vendor logos?
- Does the new design system preserve the RopeBridge philosophy?

Only after visual approval should the new route be promoted, merged, or used as the basis for future archetypes.

---

## Quick Start Context for Future AI Sessions

Interpret this project as small product infrastructure for physical-to-digital QR intake experiences.

Do not drift away from:

- plain static HTML/CSS/JS
- mobile-first QR landing pages
- insert-only browser access to Supabase
- reusable templates over bespoke pages
- config-driven campaign/vendor differences
- minimal visitor friction
- recognition continuity
- clear security boundaries around Supabase keys and RLS

Current active work is the `design-system-v1` branch and draft PR #2. It adds a parallel SamplePass v1 route and shared RopeBridge CSS design-system layer without touching the original SamplePass route.

The most important architectural principle is that RopeBridge should make new QR experiences cheap to create without making the codebase feel like a pile of unrelated landing pages. Keep the bones reusable, keep the config explicit, and keep the browser untrusted.
