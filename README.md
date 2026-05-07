# QR Intake System

A reusable QR-driven bones+config landing-page system for turning prototype images into secure, config-driven intake pages.

The first working prototype is the SamplePass demo/test page at `templates/samplepass-claim/index.html`.

## Repository Shape

- `templates/` contains reusable page templates.
- `templates/hero-form/` is reserved for the first reusable landing-page pattern.
- `configs/` will contain project-specific page configuration.
- `assets/` contains static assets.
- `assets/images/` contains image assets.
- `shared/` contains reusable browser-safe HTML/CSS/JS helpers.
- `supabase/` contains database schema and migrations.

## SamplePass Demo

The SamplePass page is plain HTML/CSS/JS and can be deployed as static files from GitHub Pages or Vercel.

- Template: `templates/samplepass-claim/`
- Config: `configs/samplepass-demo.js`
- Placeholder image path: `assets/images/samplepass-stand.jpg`
- Supabase table: `public.lead_requests`

## Supabase Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/migrations/202605060001_init_lead_requests.sql`.
3. In the Supabase project settings, copy the project URL.
4. Create or locate a browser-safe publishable key.
5. Put the public browser config in `configs/samplepass-demo.js`:

```js
window.SAMPLEPASS_DEMO_CONFIG = {
  SUPABASE_URL: "https://your-project-ref.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "your-publishable-key",
  BRAND_NAME: "SamplePass",
  OFFER_HEADLINE: "Get a free handcrafted QR/NFC stand",
  SUBHEADLINE:
    "Scan, tap, and connect your physical booth or table to a simple digital experience.",
  FREE_ITEM: "Premium tabletop QR/NFC stand",
  CTA_LABEL: "Claim My Free Stand",
  SUCCESS_MESSAGE: "Thanks — your SamplePass request was received.",
  IMAGE_SRC: "../../assets/images/samplepass-stand.jpg",
  PROJECT_TYPE: "samplepass",
  TEMPLATE_ID: "samplepass-claim",
  SOURCE_ID: "samplepass-demo",
  QR_ID: "friends-family-test",
};
```

Only use `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in browser-facing config or environment values. Do not add service-role keys to this repository or any frontend file.

For local-only testing, you may also create `.env` from `.env.example`, but static browser deployment reads `configs/samplepass-demo.js` unless you add your own build-time injection later.

## Deploy

### GitHub Pages

1. Commit and push the repository to GitHub.
2. In GitHub, open the repository settings.
3. Go to Pages.
4. Set the source to the branch you want to deploy, usually `main`.
5. Set the folder to the repository root.
6. Open:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/templates/samplepass-claim/
```

### Vercel

1. Import the GitHub repository into Vercel.
2. Use the default static project settings.
3. Leave the build command empty.
4. Leave the output directory empty or set it to the repository root.
5. Open:

```text
https://YOUR-VERCEL-DOMAIN/templates/samplepass-claim/
```

## Test A Submission

1. Confirm `configs/samplepass-demo.js` contains the Supabase project URL and publishable key.
2. Open `templates/samplepass-claim/index.html` locally or from the deployed URL.
3. Fill in Full name, Phone number, and Business name.
4. Optionally add Notes.
5. Click `Claim My Free Stand`.
6. Confirm the page shows:

```text
Thanks — your SamplePass request was received.
```

The browser insert uses `Prefer: return=minimal` and does not call `.select()` after insert.

## Check The Submitted Row

In Supabase:

1. Open the project.
2. Go to Table Editor.
3. Open `public.lead_requests`.
4. Find the newest row.
5. Confirm these values:

```text
project_type = samplepass
template_id = samplepass-claim
source_id = samplepass-demo
qr_id = friends-family-test
metadata.free_item = Premium tabletop QR/NFC stand
metadata.notes = the submitted notes, or blank
```

## Supabase Security Model

The only browser-facing table is `public.lead_requests`.

- RLS is enabled.
- Anonymous users may insert lead requests.
- Anonymous users may not select, update, or delete lead requests.
- `service_role` has full table access for trusted server-side or Supabase-side operations.
- Service-role keys must never be committed or exposed to frontend code.

## Development Rules

- Plain HTML/CSS/JS first.
- Mobile-first.
- Config-driven.
- Reuse templates before creating new ones.
- Do not create one-off hardcoded sites.
- Do not add frameworks unless absolutely necessary.
- Do not add auth, dashboards, admin systems, ecommerce, or CMS.
- Do not put secret keys in repo or frontend code.
- Supabase frontend code may only use a publishable key.
- Keep RLS explicit.
- Browser access must be insert-only.
- Browser form submissions must not call `.select()` after insert.

## CI

GitHub Actions runs a minimal validation workflow:

- Validates any JSON files found in the repository.
- Checks JavaScript syntax if JavaScript files exist.
- Uses least-privilege `contents: read` permissions.
