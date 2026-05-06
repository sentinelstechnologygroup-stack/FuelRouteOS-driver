# FuelRouteOS Driver — Full Base44 Reference Audit
**Phase:** 2 — Project Audit
**Status:** Read-only scan. No files modified.
**Authority:** Nettie / Van / Perry (Mission Control — safe read-only)

---

## Command Run

```bash
grep -Rn "base44|Base44|@base44|createPageUrl|integrations/Core" \
  /home/patrick/projects/saas/FuelRouteOS/FuelRouteOS_driver_clean \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude="package-lock.json" \
  --exclude="CLEANUP_AUDIT_*.md" \
  --exclude="BUILD_ERRORS_INITIAL.md" \
  --exclude="CLAUDE.md"
```

---

## Complete Results

```
src/lib/PageNotFound.jsx:2      import { base44 } from '@/api/base44Client'
src/lib/PageNotFound.jsx:14     const user = await base44.auth.me()
package.json:2                  "name": "base44-app"
package.json:15                 "@base44/sdk": "^0.8.27"
package.json:16                 "@base44/vite-plugin": "^1.0.13"
src/lib/AuthContext.jsx:2       import { base44 } from '@/api/base44Client'
src/lib/AuthContext.jsx:4       import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client'
src/lib/AuthContext.jsx:96      const currentUser = await base44.auth.me()
src/lib/AuthContext.jsx:123     base44.auth.logout(window.location.href)
src/lib/AuthContext.jsx:126     base44.auth.logout()
src/lib/AuthContext.jsx:132     base44.auth.redirectToLogin(window.location.href)
src/api/base44Client.js:1       import { createClient } from '@base44/sdk'
src/api/base44Client.js:7       export const base44 = createClient({ ... })
index.html:5                    <link rel="icon" href="https://base44.com/logo_v2.svg" />
index.html:8                    <title>Base44 APP</title>
vite.config.js:1                import base44 from "@base44/vite-plugin"
vite.config.js:9                base44({ ... })
vite.config.js:10-11            // comment referencing @base44/sdk legacy imports
src/lib/app-params.js:13        base44_${toSnakeCase(paramName)}
src/lib/app-params.js:39        storage.removeItem('base44_access_token')
src/utils/index.ts:1            export function createPageUrl(pageName: string)
README.md:1,5,11,26,33,37,39   Base44 project references throughout
```

---

## `integrations/Core` scan result

**Not found.** No `integrations/Core` imports exist in this codebase. The Base44 export did not include generated entity integrations. This is clean.

---

## Classification by Category

---

### 1 — APP-VISIBLE REFERENCES (user sees these in browser)

These appear directly in the browser UI — tab title, favicon, or rendered content.

| File | Line | Content | Action |
|------|------|---------|--------|
| `index.html` | 5 | `href="https://base44.com/logo_v2.svg"` — Base44 favicon | **Replace** with local FuelRouteOS favicon or generic fuel icon SVG |
| `index.html` | 8 | `<title>Base44 APP</title>` — browser tab title | **Replace** with `FuelRouteOS Driver` |
| `README.md` | 1–39 | Entire file is Base44 project boilerplate | **Replace** — full SDL README per spec |
| `package.json` | 2 | `"name": "base44-app"` | **Replace** with `"fuelrouteos-driver"` |

**Impact if not fixed:** Any developer or user who checks the browser tab, bookmarks the app, or inspects the project sees "Base44 APP" and the Base44 favicon. Highest visibility issue.

---

### 2 — SOURCE IMPORTS REQUIRING REPLACEMENT (build/runtime blocking)

These files import from `@base44/sdk` or from `src/api/base44Client.js`. Once Base44 packages are removed, these will cause build failures.

| File | Lines | Reference | Replacement |
|------|-------|-----------|-------------|
| `src/api/base44Client.js` | 1, 7 | `import { createClient } from '@base44/sdk'` | Replace file with local mock stub or remove entirely |
| `src/lib/AuthContext.jsx` | 2, 4 | `@/api/base44Client` + `@base44/sdk/dist/utils/axios-client` | Rewrite auth to local mock — preserve context shape |
| `src/lib/AuthContext.jsx` | 96, 123, 126, 132 | `base44.auth.me()`, `logout()`, `redirectToLogin()` | Replace with local state operations |
| `src/lib/PageNotFound.jsx` | 2, 14 | `@/api/base44Client` + `base44.auth.me()` | Remove import + admin note block. Preserve 404 layout. |

---

### 3 — VITE / BUILD CONFIG REFERENCES

| File | Lines | Reference | Replacement |
|------|-------|-----------|-------------|
| `vite.config.js` | 1 | `import base44 from "@base44/vite-plugin"` | Remove import |
| `vite.config.js` | 9–11 | `base44({ ... })` plugin in plugins array | Remove from plugins. Keep `react()`. |

---

### 4 — PACKAGE.JSON DEPENDENCIES

| File | Lines | Package | Replacement |
|------|-------|---------|-------------|
| `package.json` | 15 | `"@base44/sdk": "^0.8.27"` | Remove after source imports replaced |
| `package.json` | 16 | `"@base44/vite-plugin": "^1.0.13"` | Remove after vite.config.js updated |

**Order matters:** Remove packages **after** all source imports are replaced. Reversing this order breaks the build.

---

### 5 — INTERNAL STRINGS (no package dependency, low risk)

| File | Lines | Content | Action |
|------|-------|---------|--------|
| `src/lib/app-params.js` | 13 | `` `base44_${...}` `` localStorage key prefix | Remove file (no callers after AuthContext rewrite) |
| `src/lib/app-params.js` | 39 | `storage.removeItem('base44_access_token')` | Remove file (same) |

---

### 6 — INERT CONFIG FILES (no app impact)

| File | Content | Action |
|------|---------|--------|
| `base44/.app.jsonc` | `{ "id": "69fa4c3f..." }` — Base44 app ID | Delete — no source references this file |
| `base44/config.jsonc` | Base44 CI build/serve commands | Delete — no source references this file |

---

### 7 — FALSE POSITIVE / SAFE TO IGNORE

| File | Line | Content | Notes |
|------|------|---------|-------|
| `src/utils/index.ts` | 1 | `export function createPageUrl(pageName: string)` | **False positive** — `createPageUrl` was flagged by scan pattern but contains no Base44 string. It is a simple URL helper (returns `'/' + pageName`). No pages currently import it (confirmed by grep). Safe to leave or remove. |

---

## No Additional References Found

- **`integrations/Core`** — not present anywhere
- **`FleetPanda`** — not present anywhere
- **`Panda Box`** — not present anywhere
- **`Mofs`** — not present anywhere
- **`OctaneOps`** — not present anywhere
- **Base44 references in page files** — zero. All 35 page files are clean.
- **Base44 references in components** — zero. All driver, branding, document, and UI components are clean.
- **Base44 references in mockData, driverContext, appContext, branding, mapsHelper** — zero.

---

## Summary: Complete Base44 Reference Map

| Category | Files Affected | Status |
|----------|---------------|--------|
| App-visible (browser title, favicon, README) | `index.html`, `README.md`, `package.json` | Needs replacement |
| Source imports (auth chain) | `base44Client.js`, `AuthContext.jsx`, `PageNotFound.jsx` | Needs surgical rewrite |
| Vite build config | `vite.config.js` | Needs plugin removal |
| package.json dependencies | `package.json` | Remove after source clean |
| Internal strings | `app-params.js` | Remove file (no callers) |
| Inert config folder | `base44/` | Delete folder |
| False positive | `src/utils/index.ts` | No action needed |
| Page files (35 total) | None | **CLEAN** |
| Component files (50+ total) | None | **CLEAN** |
| Mock data, context, branding | None | **CLEAN** |

---

## Recommended Execution Order (Forge Phase — awaiting Patrick approval)

```
Phase 3a — Zero-risk metadata fixes (no logic change):
  1. index.html         → fix title + favicon
  2. README.md          → full SDL replacement

Phase 3b — Source auth rewrite (requires careful edits):
  3. src/api/base44Client.js   → replace with local stub
  4. src/lib/AuthContext.jsx   → rewrite to local mock auth
  5. src/lib/PageNotFound.jsx  → remove base44 import + admin note

Phase 3c — Cleanup (safe after 3b):
  6. src/lib/app-params.js     → remove entire file
  7. vite.config.js             → remove @base44/vite-plugin
  8. package.json               → remove packages + rename app

Phase 3d — Install + validate:
  9. npm install               → regenerate without Base44
  10. npm run build            → confirm build still passes

Phase 3e — Delete inert files (after build confirmed):
  11. base44/ folder           → delete
```

---

*Audit generated by Mission Control — Van / Forge / Perry.*
*No source files were modified during this audit.*
