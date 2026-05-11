# RopeBridge — Current Project Status (2026-05-10)

## Current Focus
Refining the SamplePass UX/aesthetic to match the reference mockups while validating the multi-vendor remembered-user flow.

---

# Current State

## Working

### Multi-State Flow
The SamplePass flow currently supports:

1. State 1 — Connect
2. State 2 — Claim Offer
3. State 3 — Connected / Follow-Up

---

### Remembered User Flow
Implemented and confirmed working:

- First name capture
- Phone capture
- Consent flow
- Local remembered-user behavior
- Cross-vendor persistence
- Returning users skip State 1 automatically

Current behavior:

- First vendor requires onboarding
- Additional vendors open directly to State 2
- User identity persists locally via localStorage

---

### Dynamic Vendor Pages
Vendor/product content now updates dynamically from URL parameters.

Examples:

- Backyard Blooms (Honey)
- Northstar Coffee
- Stone Hearth Bakery
- Foxglove Florals
- Iron Skillet BBQ

Vendor URLs can now change:

- brand
- category
- product
- description
- CTA text
- source identifiers

without modifying the template itself.

---

### GitHub Pages
Current live deployment:

https://lukebrush555-hue.github.io/qr-intake-system/templates/samplepass-claim/

---

# UX / Aesthetic Status

## Major Improvements Completed

The following visual systems were substantially rewritten:

- editorial spacing
- typography hierarchy
- ornamental dividers
- footer treatment
- button proportions
- cream-paper visual treatment
- seal/wax aesthetic
- mobile layout scaling
- connected-card composition
- vendor hierarchy

---

## Remaining Aesthetic Gap

The implementation is significantly closer to the reference images, but not fully matched yet.

Current biggest mismatch:

- product hero imagery

The original implementation still relied on the QR stand image.

Temporary override work was added to approximate the reference layout visually.

---

# Product Image Direction

New direction established:

Do NOT use generic marketing banners.

Preferred visual style:

- artisan product still life
- neutral cream backgrounds
- soft natural lighting
- handcrafted / local aesthetic
- premium but believable
- isolated product focus

Example products generated:

- raw honey jar
- iced coffee
- cinnamon roll
- flower bouquet
- smoked brisket slider

These images were approved stylistically.

---

# Current Technical Architecture

## Frontend

- Static HTML/CSS/JS
- GitHub Pages deployment
- Query-parameter-driven configuration
- LocalStorage persistence

---

## Backend

Supabase:

- lead_requests table active
- anonymous insert flow active
- remembered-user metadata included
- vendor claim submission working

---

# Important Recent Fixes

## Cache Busting
Added cache-busting query params to:

- app.js
- styles.css
- config JS

Reason:

Mobile GitHub Pages caching was serving stale JavaScript and breaking remembered-user testing.

---

## State 1 Default Entry
The deployment originally loaded State 2 by default.

Fixed:

- Stage 1 is now the default public entry point.

---

# Outstanding TODOs

## High Priority

### Vendor Product Assets
Still incomplete:

- commit finalized artisan product images into repo
- map vendor/product -> image asset
- remove temporary visual overrides
- fully align State 2 hero imagery with references

---

### OTP / SMS Verification
Current flow is simulated.

Still needed:

- actual SMS verification flow
- Twilio or equivalent integration
- verification code entry UX

---

### Better Persistent Identity
Current remembered-user system uses localStorage only.

Future direction:

- Supabase identity linkage
- phone-first identity model
- device-aware persistence
- optional one-time login forever model

---

# Important Product Insights Confirmed

## Core UX Insight
The remembered-user experience materially improves the product.

The flow now feels:

- lower friction
- vendor-network-aware
- event-wide
- closer to the original RopeBridge vision

---

## Aesthetic Insight
The project quality improved substantially when moving away from:

- generic SaaS styling
- dashboard aesthetics
- QR-tech branding

and toward:

- artisan editorial layouts
- luxury packaging inspiration
- farmers-market visual language
- soft premium product photography

---

# Current Strategic Direction

RopeBridge is evolving toward:

"One sign-in across participating local vendors"

rather than:

"A single QR landing page"

The remembered-user/vendor-network behavior appears to be a major differentiator.
