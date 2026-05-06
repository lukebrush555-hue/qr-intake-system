# Codex Operating Instructions

This repository is a reusable QR-driven bones+config landing-page system. Treat it as product infrastructure, not as a pile of one-off websites.

## Core Rules

- Plain HTML, CSS, and JavaScript first.
- Mobile-first by default.
- Config-driven before code-driven.
- Reuse templates before creating new ones.
- Do not create hardcoded one-off sites.
- Do not add frameworks unless there is a clear, unavoidable need.
- Do not add auth, dashboards, admin systems, ecommerce, or CMS features.
- Do not put secret keys in the repository or frontend code.

## Template Rules

- Templates belong in `templates/`.
- Shared browser code belongs in `shared/`.
- Project-specific content belongs in `configs/`.
- Images and static assets belong in `assets/`.
- A new landing page should usually be a config file plus assets, not a new standalone site.

## Supabase Rules

- Frontend code may only use `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.
- Never place service-role keys in frontend code, config files, examples, or docs snippets.
- Keep RLS explicit.
- Browser access must be insert-only.
- Browser form submissions must not call `.select()` after insert.
- The anonymous role must not have `SELECT`, `UPDATE`, or `DELETE` access to lead data.

## Change Discipline

- Keep changes small and reusable.
- Prefer boring, inspectable code over clever abstractions.
- Update documentation when setup, configuration, security, or template behavior changes.
- When adding JavaScript, make sure it passes syntax checks in CI.
