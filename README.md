# QR Intake System

A reusable QR-driven bones+config landing-page system for turning prototype images into secure, config-driven intake pages.

This repository is intentionally scaffold-only right now. It does not include the first actual prototype site.

## Repository Shape

- `templates/` contains reusable page templates.
- `templates/hero-form/` is reserved for the first reusable landing-page pattern.
- `configs/` will contain project-specific page configuration.
- `assets/` contains static assets.
- `assets/images/` contains image assets.
- `shared/` contains reusable browser-safe HTML/CSS/JS helpers.
- `supabase/` contains database schema and migrations.

## Manual Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/migrations/202605060001_init_lead_requests.sql`.
3. In the Supabase project settings, copy the project URL.
4. Create or locate a browser-safe publishable key.
5. Create a local `.env` file from `.env.example`.
6. Set:

```bash
SUPABASE_URL=your-project-url
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

7. Do not add service-role keys to this repository.
8. When browser form submission code is added, insert into `public.lead_requests` without chaining `.select()`.

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
