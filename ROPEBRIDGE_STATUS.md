# RopeBridge Current Status

## Project Identity

RopeBridge is currently represented in this repository as `qr-intake-system`: a reusable, QR-driven intake foundation for turning small physical-world prompts into simple digital landing pages.

The core philosophy is "bones + config": the template is the reusable product surface, while each campaign/vendor/page should mostly be expressed as configuration and assets. The browser-facing experience should stay small, mobile-first, QR-first, and security-conscious.

The current archetype focus is the SamplePass demo: a visitor scans or opens a static claim page, sees a clear offer for a free QR/NFC stand, submits lightweight contact/business details, and the request is inserted into Supabase.

## Current Architecture

- Frontend stack: plain static HTML, CSS, and JavaScript. There is no framework, bundler, package manager, or build step.
- Backend/services: Supabase PostgREST is used directly from browser JavaScript for insert-only lead capture.
- Deployment method: static hosting from the repository root, documented for GitHub Pages and Vercel.
- Routing/query parameter structure: current routing is path-based only. The active page is `templates/samplepass-claim/`. There is no query-parameter router or `URLSearchParams`-based state/config loader in the current code.
- Configuration loading: `templates/samplepass-claim/index.html` loads `../../configs/samplepass-demo.js`, which sets `window.SAMPLEPASS_DEMO_CONFIG`.

## Repository Structure

- `README.md`: setup, deployment, Supabase, security, and testing instructions for the QR intake system.
- `PROJECT_CONTEXT.md`: product philosophy and project boundaries.
- `AGENTS.md`: operating rules for future Codex/AI work in the repo.
- `.env.example`: local example values for `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.
- `configs/samplepass-demo.js`: browser-facing SamplePass configuration, including Supabase URL/key, content strings, asset path, and tracking IDs.
- `templates/samplepass-claim/index.html`: current active static landing page and form markup.
- `templates/samplepass-claim/app.js`: config binding, validation, form submission, and Supabase insert logic.
- `templates/samplepass-claim/styles.css`: mobile-first visual styling for the SamplePass claim page.
- `templates/hero-form/.gitkeep`: reserved namespace for a future reusable hero/form template.
- `assets/images/samplepass-stand.jpg`: current offer image for the SamplePass demo.
- `shared/.gitkeep`: placeholder for future reusable browser-safe helpers.
- `supabase/schema.sql`: current Supabase schema and RLS grants/policy.
- `supabase/migrations/202605060001_init_lead_requests.sql`: migration matching `schema.sql`.
- `.github/workflows/ci.yml`: minimal CI that validates JSON and checks JavaScript syntax.

## Current User Flow

The intended RopeBridge product language describes a 3-state flow:

1. Connect
2. Interact
3. Connected

In the current implementation, only the "Interact" state is concretely implemented as a single SamplePass claim form. The visitor lands directly on the claim page, reviews the offer, enters details, and submits the request.

Current implementation details:

- The HTML page renders a brand header, product/offer image, offer copy, and lead form.
- Configurable text and image values are applied via `data-config-text`, `data-config-src`, and `data-config-alt` attributes.
- The form collects `name`, `phone`, `business_name`, and optional `notes`.
- HTML constraint validation is used, with required fields for name, phone, and business name.
- On submit, the button is disabled, status text changes to a sending state, and the browser sends a `POST` to Supabase.
- On success, the form resets and displays `SUCCESS_MESSAGE`.
- On failure, a generic retry message is shown and the error is logged to the console.

State 1 ("Connect") and State 3 ("Connected") are product concepts but are not yet separate implemented routes, screens, or persisted UI states in this repository.

## Supabase Integration

Current tables:

- `public.lead_requests`

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

Active queries:

- Browser code sends `POST /rest/v1/lead_requests`.
- Headers include `apikey`, `Authorization: Bearer <publishable key>`, `Content-Type: application/json`, and `Prefer: return=minimal`.
- The code does not call `.select()` or perform any browser-side read/update/delete query.

Environment/config variables referenced:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Additional browser config values:

- `BRAND_NAME`
- `OFFER_HEADLINE`
- `SUBHEADLINE`
- `FREE_ITEM`
- `CTA_LABEL`
- `SUCCESS_MESSAGE`
- `IMAGE_SRC`
- `PROJECT_TYPE`
- `TEMPLATE_ID`
- `SOURCE_ID`
- `QR_ID`

Auth/session approach:

- There is no user auth, login, session handling, dashboard, or authenticated app flow.
- The frontend uses the Supabase publishable key as an anonymous browser client credential for direct insert.

RLS assumptions visible in code/schema:

- RLS is enabled on `public.lead_requests`.
- `anon` and `authenticated` are revoked broadly first.
- `anon` is granted schema usage and insert access on `public.lead_requests`.
- A single policy allows anonymous inserts with `with check (true)`.
- `service_role` has full access for trusted server-side or Supabase-side operations.
- Browser access is intentionally insert-only.

## Current Working Features

- Static SamplePass claim page can run without a build step.
- Config-driven copy, image source, alt text, CTA label, success message, and tracking fields.
- Mobile-first responsive layout with a two-column desktop layout at wider widths.
- Lead form with required fields and optional notes.
- Direct Supabase insert into `public.lead_requests`.
- Insert payload includes project/template/source/QR identifiers plus `metadata.free_item` and `metadata.notes`.
- Success/error/sending status messages are visible to users.
- Supabase schema and migration are present.
- Basic CI checks JavaScript syntax and JSON validity.
- Static deployment path is documented for GitHub Pages and Vercel.

## Incomplete / Planned Features

- The full RopeBridge 3-state Connect -> Interact -> Connected flow is not yet implemented as distinct screens/states.
- `templates/hero-form/` is reserved but not implemented.
- `shared/` exists only as a placeholder.
- No reusable template engine or shared config loader exists yet.
- No query-parameter-based routing, QR-specific parameter parsing, or dynamic config resolution exists.
- No admin dashboard, lead viewer, CRM integration, notifications, or follow-up automation exists.
- No server-side functions or trusted backend layer exists.
- No anti-spam/rate-limit/honeypot validation is implemented in the browser or database policy.
- No robust phone normalization, email capture, or schema-level field validation is implemented.
- No automated browser/end-to-end test coverage exists.
- No visual variants for multiple vendors/archetypes exist yet beyond SamplePass.

## UI / UX Rules

Preserve these rules unless the user explicitly changes the product direction:

- Mobile-first: QR traffic likely starts on phones; the first viewport should be immediately useful.
- QR-first: optimize for someone arriving from a physical scan/tap with limited patience.
- Friction-once: ask for only the minimum needed information at the moment of intent.
- Reusable templates: new campaigns should usually be config plus assets, not new one-off sites.
- Bones + config: template structure should remain reusable; vendor/campaign identity should live in config.
- State 1 visually distinct from States 2/3: the initial connect moment should feel different from interaction and confirmation once those states are implemented.
- Text-first vendor headers: favor clear vendor names/offers over overly decorative SaaS chrome.
- Avoid overengineered SaaS aesthetics: keep the UI grounded, direct, and physical-world friendly rather than dashboard-like or marketing-heavy.
- Keep forms obvious, tappable, and forgiving.
- Do not add frameworks, auth, CMS, ecommerce, or dashboards unless there is a clear product need.

## Known Risks / Technical Debt

- `configs/samplepass-demo.js` contains concrete Supabase project values; they are publishable/browser-safe, but future contributors must not confuse this with permission to expose service-role keys.
- `.env.example` also contains concrete values rather than placeholders, which is convenient but may blur the line between example and deployment config.
- Config shape is currently global-variable based and template-specific (`window.SAMPLEPASS_DEMO_CONFIG`), which will not scale cleanly to many templates/vendors.
- Form field reading assumes all requested fields exist and calls `.trim()` directly on `FormData` values.
- There is no network timeout or retry strategy around submission.
- Error handling is intentionally generic and does not expose Supabase response details to the user.
- RLS insert policy allows any anonymous insert, so spam protection and rate limiting are future concerns.
- No schema constraints enforce required lead fields beyond broad column types/defaults.
- `schema.sql` and the migration duplicate the same SQL and must be kept in sync manually.
- The current UI is one concrete SamplePass page; extracting a reusable `hero-form` pattern remains future work.
- There is no implemented Connect/Connected state persistence, so future sessions should not assume a completed RopeBridge flow exists.

## Recommended Next Step

Implement the reusable 3-state RopeBridge template skeleton in plain HTML/CSS/JS, preserving the current SamplePass behavior as one config-driven instance. The highest-leverage version of that step is to extract a generic config contract and state model for Connect -> Interact -> Connected before adding more vendors or visual variants.

## Quick Start Context for Future AI Sessions

Interpret this project as small product infrastructure for physical-to-digital QR intake experiences. It is not a SaaS dashboard, not a CMS, not an ecommerce app, and not an auth system.

Do not drift away from:

- plain static HTML/CSS/JS
- mobile-first QR landing pages
- insert-only browser access to Supabase
- reusable templates over bespoke pages
- config-driven campaign/vendor differences
- minimal visitor friction
- clear security boundaries around Supabase keys and RLS

The most important architectural principle is that RopeBridge should make new QR experiences cheap to create without making the codebase feel like a pile of unrelated landing pages. Keep the bones reusable, keep the config explicit, and keep the browser untrusted.
