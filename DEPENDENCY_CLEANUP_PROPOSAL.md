# FuelRouteOS Driver — Dependency Cleanup Proposal
**Phase:** 2 → 3 Transition
**Status:** Proposal only. No packages removed. Awaiting Patrick approval.
**Authority:** Nettie / Van / Perry — Mission Control

---

## Overview

The Base44 export includes 65+ packages. Approximately 16 have zero imports anywhere in `src/`. Several are duplicates, deprecated, or irrelevant to a driver operations app. This document proposes a safe, ordered cleanup strategy.

**No packages will be removed until Patrick explicitly approves this proposal.**

---

## Batch 1 — Base44 Packages (Remove with source cleanup)

**Priority: HIGHEST. Must be removed. No driver app functionality depends on them.**

| Package | Location | Why Remove | Blocker |
|---------|----------|------------|---------|
| `@base44/sdk` | `dependencies` | Entire Base44 auth runtime. Creates axios + socket.io vuln chain. Not needed in local mock mode. | Source code must be updated first (AuthContext, base44Client, PageNotFound) |
| `@base44/vite-plugin` | `dependencies` | Injects Base44 proxy, analytics, visual edit agent into build. Not appropriate for production. | `vite.config.js` must remove plugin first |

**After removing these two packages, run `npm audit` — the axios and socket.io-parser high-severity chains will be eliminated.**

**Estimated bundle size savings:** Significant — `@base44/sdk` bundles axios and SDK internals.

**Test after removal:**
```
npm install
npm run build       ← must pass
npm run dev         ← app must load
login → home flow   ← must work
```

---

## Batch 2 — Zero-Import Bloat (Remove with approval, low risk)

**Priority: HIGH. Zero imports. No page or component uses these.**

| Package | Imports | Why Remove | Risk |
|---------|---------|------------|------|
| `three` | 0 | 3D graphics library. No use case in a fuel delivery driver app. | None — not imported anywhere |
| `react-leaflet` | 0 | Map rendering library. App uses browser deep links (mapsHelper.js) instead. | None — not imported anywhere |
| `@stripe/react-stripe-js` | 0 | Payment SDK. No payment flows in driver app. | None — not imported anywhere |
| `@stripe/stripe-js` | 0 | Payment SDK core. No payment flows in driver app. | None — not imported anywhere |
| `canvas-confetti` | 0 | Confetti animation. Irrelevant to driver operations. | None — not imported anywhere |
| `framer-motion` | 0 | Animation library. Not imported in any page or component. | None — not imported anywhere |
| `react-hot-toast` | 0 | Toast notifications. Duplicate — `sonner` is used instead. | None — not imported anywhere |
| `react-markdown` | 0 | Markdown renderer. Not used in any active screen. | None — not imported anywhere |
| `moment` | 0 | Date library. Duplicate — `date-fns` is used instead (10 files). | None — not imported anywhere |
| `lodash` | 0 | Utility library. Not imported anywhere. Has high-severity vulns. | None — not imported anywhere |
| `@hello-pangea/dnd` | 0 | Drag-and-drop. Not used in driver workflow. | None — not imported anywhere |
| `react-quill` | 0 | Rich text editor. Not used anywhere. Has XSS vulnerability. | None — not imported anywhere |

**Estimated bundle size savings:** Very large. `three`, `react-leaflet`, `framer-motion`, and `moment` are among the heaviest JS packages available.

**Test after removal:**
```
npm install
npm run build       ← must pass
```

No page testing required — none of these are imported.

---

## Batch 3 — Shadcn UI Components (Conditional — review usage first)

These packages are only imported inside `src/components/ui/` wrappers. They are not directly used by any page file currently. However, since they are part of the installed shadcn component set, they may be needed by future screens.

**Recommendation: Preserve for now. Do not remove until Phase 11 QA confirms no page uses them.**

| Package | Import Location | Used by page? | Recommendation |
|---------|----------------|---------------|----------------|
| `react-day-picker` | `ui/calendar.jsx` | Not confirmed | Preserve — scheduling forms may need it |
| `cmdk` | `ui/command.jsx` | Not confirmed | Preserve — command palette may be used |
| `embla-carousel-react` | `ui/carousel.jsx` | Not confirmed | Preserve — scan pages may use carousel |
| `input-otp` | `ui/input-otp.jsx` | Not confirmed | Preserve — PIN login uses OTP-style input |
| `react-resizable-panels` | `ui/resizable.jsx` | Not confirmed | Preserve — no urgent need to remove |
| `recharts` | `ui/chart.jsx` | Not confirmed | Preserve — inventory/route summary may use charts |
| `vaul` | `ui/drawer.jsx` | Likely yes | Preserve — bottom sheets used throughout app |
| `react-hook-form` | `ui/form.jsx` | Likely yes | Preserve — forms throughout app |

---

## Batch 4 — Borderline Near-Term Dependencies

These have zero current imports but are directly relevant to planned driver workflow features.

| Package | Imports | Why Preserve | When to Revisit |
|---------|---------|--------------|-----------------|
| `html2canvas` | 0 | BOL/POD screenshot capture — planned workflow feature | After Phase 11 QA — confirm or add usage |
| `jspdf` | 0 | PDF generation for delivery docs, BOL exports — planned | After Phase 11 QA — confirm or add usage |
| `@hookform/resolvers` | 0 | Form validation resolver — likely needed when forms get zod schemas | After Phase 11 QA |
| `zod` | 0 | Schema validation — likely needed for production form validation | After Phase 11 QA |
| `next-themes` | 1 | Only in `sonner.jsx` for theme detection — app uses its own appContext theme system | Low priority: update sonner.jsx to read from appContext; then remove `next-themes` |

---

## Batch 5 — Security Review Required (Perry)

| Package | Issue | Action |
|---------|-------|--------|
| `@stripe/react-stripe-js` | No imports, no use case in driver app — but if ever added, requires PCI compliance review | Remove now (zero imports, no plans) |
| `@stripe/stripe-js` | Same as above | Remove now |
| `vite` (≤6.4.1) | Path traversal + arbitrary file read via dev WebSocket | Upgrade: `npm install vite@latest --save-dev` — requires Patrick approval |
| `postcss` (<8.5.10) | XSS in CSS stringify | Upgrade: `npm install postcss@latest --save-dev` — requires Patrick approval |
| `lodash` (≤4.17.23) | Code injection + prototype pollution | Remove (zero imports) — approved under Batch 2 |
| `react-quill` / `quill` | XSS | Remove (zero imports) — approved under Batch 2 |

---

## Proposed Removal Order

```
Step 1 (Batch 1 — requires source cleanup first):
  - Replace AuthContext.jsx, PageNotFound.jsx, base44Client.js, vite.config.js
  - Then: npm uninstall @base44/sdk @base44/vite-plugin
  - Then: npm install && npm run build

Step 2 (Batch 2 — safe, zero imports):
  - npm uninstall three react-leaflet @stripe/react-stripe-js @stripe/stripe-js \
      canvas-confetti framer-motion react-hot-toast react-markdown \
      moment lodash @hello-pangea/dnd react-quill
  - Then: npm install && npm run build

Step 3 (Deferred — after Phase 11 QA):
  - Review Batch 3 shadcn components for actual page usage
  - Review html2canvas / jspdf for workflow implementation
  - Remove next-themes after sonner.jsx update

Step 4 (Security upgrades — separate approval):
  - npm install vite@latest postcss@latest --save-dev
  - npm audit fix
```

---

## Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Removing a shadcn component that IS used by a page | Low | Run `npm run build` after each batch — Vite will error on missing imports |
| Breaking auth before mock is in place | Medium | Do source rewrites before removing packages |
| `react-quill` forced downgrade breaking a form | None | Zero imports confirmed |
| Stripe removal affecting hidden payment flow | None | Zero imports confirmed. No payment screens in driver app. |

---

## What Is NOT Being Removed

Regardless of any approval:

- All `@radix-ui/*` components — used throughout shadcn UI system
- `react-router-dom` — entire routing system
- `lucide-react` — all icons
- `date-fns` — date formatting throughout app
- `@tanstack/react-query` — data layer
- `tailwindcss`, `postcss`, `autoprefixer` — styling system
- `class-variance-authority`, `clsx`, `tailwind-merge` — component styling
- `sonner` — toast notifications
- `react`, `react-dom` — framework

---

## Awaiting Patrick Approval

**This proposal requires Patrick approval before any `npm uninstall` commands are run.**

Recommended approval request:
> "Approve Batch 1 (Base44 SDK removal) and Batch 2 (zero-import bloat removal) as defined in DEPENDENCY_CLEANUP_PROPOSAL.md."

---

*Proposal generated by Mission Control — Van / Forge / Perry.*
*No packages removed. No files modified. Awaiting approval.*
