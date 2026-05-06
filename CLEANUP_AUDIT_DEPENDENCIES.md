# FuelRouteOS Driver — Dependency Audit
**Phase:** 2 — Project Audit
**Status:** Read-only scan. No files modified.
**Authority:** Nettie / Van / Perry (Mission Control — safe read-only)

---

## Source File Import Counts

Scan command:
```bash
grep -rl "from '{pkg}'" src/ --include="*.jsx|*.js|*.ts|*.tsx" | wc -l
```

| Package | Files Importing | Classification | Recommendation |
|---------|----------------|----------------|----------------|
| `react-router-dom` | 43 | **A — Required now** | Keep |
| `lucide-react` | 64 | **A — Required now** | Keep |
| `class-variance-authority` | 9 | **A — Required now** | Keep |
| `date-fns` | 10 | **A — Required now** | Keep |
| `clsx` | 1 | **A — Required now** | Keep |
| `tailwind-merge` | 1 | **A — Required now** | Keep |
| `@tanstack/react-query` | 3 | **A — Required now** | Keep — used in App.jsx, query-client.js, PageNotFound.jsx |
| `sonner` | 1 | **A — Required now** | Keep — toast system in sonner.jsx |
| `react` / `react-dom` | (all files) | **A — Required now** | Keep |
| `react-hook-form` | 1 | **A — Required now** | Keep — used in ui/form.jsx |
| `vaul` | 1 | **A — Required now** | Keep — used in ui/drawer.jsx (bottom sheets) |
| `cmdk` | 1 | **B — Preserve near-term** | Keep — used in ui/command.jsx (command palette) |
| `embla-carousel-react` | 1 | **B — Preserve near-term** | Keep — used in ui/carousel.jsx |
| `input-otp` | 1 | **B — Preserve near-term** | Keep — used in ui/input-otp.jsx (PIN entry) |
| `react-resizable-panels` | 1 | **B — Preserve near-term** | Keep — used in ui/resizable.jsx |
| `react-day-picker` | 1 | **B — Preserve near-term** | Keep — used in ui/calendar.jsx |
| `recharts` | 1 | **B — Preserve near-term** | Keep — used in ui/chart.jsx (driver summary potential) |
| `next-themes` | 1 | **B — Preserve near-term** | Keep for now — only in sonner.jsx for theme detection. Note: app uses own Day/Night/Accessible system via appContext. May be removable after sonner.jsx is updated to read from appContext instead. |
| `@hello-pangea/dnd` | 0 | **C — Likely bloat** | Removal candidate — drag-and-drop, not imported anywhere |
| `framer-motion` | 0 | **C — Likely bloat** | Removal candidate — animation lib, zero imports in src |
| `react-hot-toast` | 0 | **C — Likely bloat** | Removal candidate — duplicate toast lib (sonner is used instead) |
| `react-markdown` | 0 | **C — Likely bloat** | Removal candidate — markdown renderer, zero imports |
| `lodash` | 0 | **C — Likely bloat** | Removal candidate — utility lib, zero imports (date-fns covers dates) |
| `moment` | 0 | **C — Likely bloat** | Removal candidate — date lib, zero imports (date-fns used instead) |
| `canvas-confetti` | 0 | **C — Likely bloat** | Removal candidate — confetti animation, not in a driver ops app |
| `react-quill` | 0 | **C — Likely bloat** | Removal candidate — rich text editor, zero imports |
| `@hookform/resolvers` | 0 | **C — Likely bloat** | Removal candidate — form validation resolver, zero imports |
| `zod` | 0 | **C — Likely bloat** | Removal candidate — schema validation, zero imports |
| `html2canvas` | 0 | **B/C — Borderline** | Preserve for now — planned for BOL/POD capture, screenshot-to-PDF. Zero current imports but high relevance to driver workflow. Review after Phase 11. |
| `jspdf` | 0 | **B/C — Borderline** | Preserve for now — planned for PDF document generation (BOL, POD). Zero current imports but directly supports workflow. Review after Phase 11. |
| `react-leaflet` | 0 | **D — Security + removal candidate** | Zero imports. Maps via browser deep links (mapsHelper.js) instead. Heavy dependency. Removal candidate but verify no Phase 10 plans require it. |
| `three` | 0 | **C — Likely bloat** | Removal candidate — 3D graphics library. No use case in driver app. |
| `@stripe/react-stripe-js` | 0 | **D — Security review** | Zero imports. No payment flows in driver app. Perry review required before any use. |
| `@stripe/stripe-js` | 0 | **D — Security review** | Zero imports. No payment flows in driver app. Perry review required before any use. |
| `@base44/sdk` | 3 | **REMOVE — Base44** | Remove after AuthContext + PageNotFound + base44Client rewrite |
| `@base44/vite-plugin` | 1 | **REMOVE — Base44** | Remove after vite.config.js updated |

---

## Exact Import Lines Found

### Packages imported only via shadcn/ui component wrappers

These packages are imported inside `src/components/ui/` — the shadcn-generated component layer. They are not directly imported by page files but are available to any page that uses these components.

```
src/components/ui/calendar.jsx:3     import { DayPicker } from "react-day-picker"
src/components/ui/sonner.jsx:2       import { useTheme } from "next-themes"
src/components/ui/sonner.jsx:3       import { Toaster as Sonner } from "sonner"
src/components/ui/command.jsx:2      import { Command as CommandPrimitive } from "cmdk"
src/components/ui/form.jsx:4         import { Controller, FormProvider, useFormContext } from "react-hook-form"
src/components/ui/drawer.jsx:4       import { Drawer as DrawerPrimitive } from "vaul"
src/components/ui/resizable.jsx:4    import * as ResizablePrimitive from "react-resizable-panels"
src/components/ui/chart.jsx:3        import * as RechartsPrimitive from "recharts"
src/components/ui/carousel.jsx:2     import useEmblaCarousel from "embla-carousel-react"
src/components/ui/input-otp.jsx:2    import { OTPInput, OTPInputContext } from "input-otp"
```

### Packages imported by core app files

```
src/App.jsx:2                        import { QueryClientProvider } from '@tanstack/react-query'
src/lib/query-client.js:1            import { QueryClient } from '@tanstack/react-query'
src/lib/PageNotFound.jsx:3           import { useQuery } from '@tanstack/react-query'
```

### Packages with zero imports anywhere in src/

```
react-leaflet        — 0 imports
three                — 0 imports
@stripe/react-stripe-js — 0 imports
@stripe/stripe-js    — 0 imports
canvas-confetti      — 0 imports
react-quill          — 0 imports
html2canvas          — 0 imports
jspdf                — 0 imports
framer-motion        — 0 imports
react-markdown       — 0 imports
moment               — 0 imports
react-hot-toast      — 0 imports
@hello-pangea/dnd    — 0 imports
lodash               — 0 imports
@hookform/resolvers  — 0 imports
zod                  — 0 imports
```

---

## devDependencies — All Clean

| Package | Role | Status |
|---------|------|--------|
| `vite` | Build tool | Keep — upgrade recommended (vuln in ≤6.4.1) |
| `@vitejs/plugin-react` | React Vite plugin | Keep |
| `tailwindcss` | CSS framework | Keep |
| `postcss` | CSS processing | Keep — upgrade recommended (vuln in <8.5.10) |
| `autoprefixer` | CSS prefixer | Keep |
| `typescript` | Type checking | Keep |
| `eslint` + plugins | Linting | Keep |
| `@types/react` / `@types/react-dom` | Type defs | Keep |
| `@types/node` | Node type defs | Keep |
| `globals` | ESLint globals | Keep |
| `baseline-browser-mapping` | Browser compat | Keep |

---

## Security Summary (Perry)

| Package | Severity | CVE Count | Notes |
|---------|----------|-----------|-------|
| `axios` | High | 14 | Transitive dep of `@base44/sdk`. Eliminated when SDK removed. |
| `vite` | High | 2 | Dev-only. Upgrade to ≥6.4.2. |
| `rollup` | High | 1 | Dev-only transitive. `npm audit fix` resolves. |
| `lodash` | High | 2 | Direct dep, zero imports. Remove or upgrade. |
| `react-quill` / `quill` | Moderate | 1 | XSS. Zero imports. Removal candidate. |
| `dompurify` | Moderate | 8 | Transitive. `npm audit fix` resolves. |
| `postcss` | Moderate | 1 | Dev dep. Upgrade resolves. |
| `@stripe/*` | — | — | No vulns yet, but zero imports in a driver app. Perry: flag for removal. |
| `socket.io-parser` | High | 1 | Transitive dep of `@base44/sdk`. Eliminated when SDK removed. |

**Perry Note:** Removing `@base44/sdk` alone eliminates the `axios` and `socket.io-parser` high-severity chains. This is the single highest-leverage security action available.

---

*No files modified. No packages removed. Audit only.*
*Authority: Nettie / Van / Perry — Mission Control.*
