# Project Context

`qr-intake-system` turns QR-driven prototype images into reusable, config-driven landing pages.

The system should make it fast to launch small intake pages without creating a new bespoke website every time. A QR code points a visitor to a focused landing page. The page presents a simple offer, asks for lightweight contact details, and stores the request securely.

## Philosophy

- The template is the product surface.
- The config is the project.
- The database accepts leads, but the browser never reads them back.
- Reuse beats reinvention.
- Security defaults matter more than convenience.

## What This Is

- A reusable foundation for QR landing pages.
- A place for shared templates, configs, and browser-safe code.
- A Supabase-backed insert-only intake system.

## What This Is Not

- A CMS.
- A dashboard.
- An ecommerce system.
- An authentication system.
- A collection of hardcoded campaign pages.

## Initial Template Direction

The first reusable template namespace is `templates/hero-form/`. It is reserved for a mobile-first landing page pattern with a prominent image or message, a short value proposition, and a lead form.

Do not build the first prototype site until there is a concrete prototype image or campaign brief to convert into config.
