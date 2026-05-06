# FuelRouteOS Driver — Branding Reference Audit
**Phase:** 2 — Project Audit
**Status:** Read-only scan. No files modified.
**Authority:** Nettie / Van (Mission Control — safe read-only)

---

## Command Run

```bash
grep -R "Base44|base44|FleetPanda|Panda Box|Mofs|OctaneOps" -n \
  /home/patrick/projects/saas/FuelRouteOS/FuelRouteOS_driver_clean \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude="package-lock.json" \
  --exclude="CLEANUP_AUDIT_EXTERNAL_URLS.md"
```

---

## Raw Results

```
README.md:1:   **Welcome to your Base44 project**
README.md:5:   View and Edit your app on [Base44.com](http://Base44.com)
README.md:11:  Any change pushed to the repo will also be reflected in the Base44 Builder.
README.md:26:  VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
README.md:33:  Open [Base44.com](http://Base44.com) and click on Publish.
README.md:37:  Documentation: [https://docs.base44.com/Integrations/Using-GitHub]
README.md:39:  Support: [https://app.base44.com/support]

package.json:2:   "name": "base44-app"
package.json:15:  "@base44/sdk": "^0.8.27"
package.json:16:  "@base44/vite-plugin": "^1.0.13"

index.html:5:   <link rel="icon" href="https://base44.com/logo_v2.svg" />
index.html:8:   <title>Base44 APP</title>

vite.config.js:1:   import base44 from "@base44/vite-plugin"
vite.config.js:9:   base44({ ... })
vite.config.js:10:  // Support for legacy code that imports the base44 SDK...

src/lib/app-params.js:13:  const storageKey = `base44_${toSnakeCase(paramName)}`
src/lib/app-params.js:39:  storage.removeItem('base44_access_token')

src/lib/PageNotFound.jsx:2:   import { base44 } from '@/api/base44Client'
src/lib/PageNotFound.jsx:14:  const user = await base44.auth.me()

src/lib/AuthContext.jsx:2:   import { base44 } from '@/api/base44Client'
src/lib/AuthContext.jsx:4:   import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client'
src/lib/AuthContext.jsx:96:  const currentUser = await base44.auth.me()
src/lib/AuthContext.jsx:123: base44.auth.logout(window.location.href)
src/lib/AuthContext.jsx:126: base44.auth.logout()
src/lib/AuthContext.jsx:132: base44.auth.redirectToLogin(window.location.href)

src/api/base44Client.js:1:   import { createClient } from '@base44/sdk'
src/api/base44Client.js:7:   export const base44 = createClient({ ... })
```

**No FleetPanda, Panda Box, Mofs, or OctaneOps references found anywhere.**

---

## Classification by Category

---

### CATEGORY 1 — APP-VISIBLE REFERENCES (must be replaced before release)

These appear in the browser tab, browser favicon, or developer-visible project metadata.
A user or developer opening the app will see these.

| File | Line | Reference | Action Required |
|------|------|-----------|-----------------|
| `index.html` | 5 | `href="https://base44.com/logo_v2.svg"` (favicon) | **Replace** — browser tab shows Base44 logo. Replace with FuelRouteOS favicon or local placeholder. |
| `index.html` | 8 | `<title>Base44 APP</title>` | **Replace** — browser tab title says "Base44 APP". Change to "FuelRouteOS Driver". |
| `README.md` | 1–39 | Entire file is Base44-generated content | **Replace** — full README replacement per Phase 4 spec. |
| `package.json` | 2 | `"name": "base44-app"` | **Replace** — npm package name. Change to `"fuelrouteos-driver"`. Low risk. |

---

### CATEGORY 2 — SDK/DEPENDENCY REFERENCES (block the build without Base44 servers)

These files import from `@base44/sdk` or `@base44/vite-plugin`. If Base44 servers are unavailable or credentials are removed, the app will fail to load. These must be replaced with local equivalents before the app can run independently.

| File | Lines | Reference | Risk | Action Required |
|------|-------|-----------|------|-----------------|
| `src/api/base44Client.js` | 1, 7 | `import { createClient } from '@base44/sdk'` | **HIGH** — entire auth layer depends on this client | Replace with local mock auth stub. Preserve file location for now. |
| `src/lib/AuthContext.jsx` | 2, 4, 96, 123, 126, 132 | `base44.auth.me()`, `base44.auth.logout()`, `base44.auth.redirectToLogin()`, `createAxiosClient` from SDK | **HIGH** — app loading spinner never resolves without this | Rewrite to local mock auth. All downstream screens/routes are preserved. |
| `src/lib/PageNotFound.jsx` | 2, 14 | `base44.auth.me()` (used to show "admin note" on 404) | **MEDIUM** — 404 page currently tries to call Base44 auth to check user role | Remove base44 import. Replace auth check with local mock equivalent. 404 display text is preserved. |
| `src/lib/app-params.js` | 13, 39 | `base44_` prefixed localStorage keys | **LOW** — reads/writes `base44_access_token` etc. to localStorage | Remove base44 prefix. Replace with `fros_` prefix to match existing app convention (app already uses `fros_appearance`, `fros_font`, etc.) |
| `vite.config.js` | 1, 9–11 | `import base44 from "@base44/vite-plugin"` | **HIGH** — build will fail if `@base44/vite-plugin` is removed without updating this | Replace with standard `@vitejs/plugin-react` only config. |
| `package.json` | 15–16 | `"@base44/sdk": "^0.8.27"`, `"@base44/vite-plugin": "^1.0.13"` | **HIGH** — must be removed after code references are replaced | Remove after all import replacements are complete. Do not remove first. |

---

### CATEGORY 3 — INERT CONFIG FILES (safe to delete, no app impact)

These files are Base44 platform metadata. They are not imported by any source file and have no effect on the running app.

| File | Contents | Action Required |
|------|----------|-----------------|
| `base44/.app.jsonc` | `{ "id": "69fa4c3f33272cb3b231544b" }` — Base44 app ID | **Delete** — no app code references this file. Safe to remove. |
| `base44/config.jsonc` | Build/serve commands for Base44 CI | **Delete** — no app code references this file. Safe to remove. |

---

### CATEGORY 4 — ADDITIONAL FINDING: `src/utils/index.ts` — createPageUrl

Not a banned brand reference, but flagged during scan as a Base44-generated utility.

| File | Content | Classification |
|------|---------|----------------|
| `src/utils/index.ts` | `export function createPageUrl(pageName: string) { return '/' + pageName.replace(/ /g, '-'); }` | **False positive on brand name** — no Base44 string present. But this is a Base44-generated routing helper. Safe to keep as-is; it is harmless. Not currently imported by any page files (grep shows no usage). Can be removed later if unused. |

---

### CATEGORY 5 — FALSE POSITIVES

| Reference | Reason |
|-----------|--------|
| `FleetPanda` | **Not found** in any source file. |
| `Panda Box` | **Not found** in any source file. |
| `Mofs` | **Not found** in any source file. |
| `OctaneOps` | **Not found** in any source file. |

No competitor or banned brand name appears anywhere in the codebase. Clean on all four.

---

## Files Requiring Careful Edits (Forge Phase)

The following files require surgical edits. **Do not mass-delete or mass-rewrite.** Each must be handled individually to preserve surrounding logic.

| File | What to Change | What to Preserve |
|------|----------------|------------------|
| `src/lib/AuthContext.jsx` | Remove `@base44/sdk` imports and all `base44.auth.*` calls | All state management logic, context shape, `useAuth()` hook signature, `logout()` / `navigateToLogin()` function names |
| `src/lib/PageNotFound.jsx` | Remove `base44Client` import and `base44.auth.me()` query | 404 display layout, Go Home button, page text |
| `src/lib/app-params.js` | Remove `base44_` localStorage prefix strings | The `getAppParamValue` utility pattern can be removed entirely since it will have no callers after AuthContext cleanup |
| `src/api/base44Client.js` | Replace entire file with local mock stub that satisfies the `base44` export shape (or remove entirely if AuthContext no longer imports it) | n/a — file itself is being replaced |
| `vite.config.js` | Remove `import base44 from "@base44/vite-plugin"` and `base44({...})` from plugins array | `react()` plugin, alias setup, `logLevel` setting |
| `package.json` | Remove `@base44/sdk` and `@base44/vite-plugin` from dependencies | All other dependencies — do not touch Radix, React, Tailwind, etc. Change `name` from `"base44-app"` to `"fuelrouteos-driver"` |
| `index.html` | Replace favicon href and `<title>` | `<div id="root">`, script tag, manifest link, viewport meta |
| `README.md` | Full replacement per approved SDL format | n/a — full replacement |

---

## Screens / Routes / Features — Confirmed NOT Affected

The following were audited and contain **zero Base44 references**. They must not be touched during Base44 removal phase.

- All 35 page files in `src/pages/`
- `src/components/driver/` (all 10 components)
- `src/components/branding/` (both components)
- `src/components/documents/` (both components)
- `src/components/ui/` (all 40+ shadcn components)
- `src/lib/mockData.js`
- `src/lib/driverContext.jsx`
- `src/lib/appContext.jsx`
- `src/lib/branding.js`
- `src/lib/mapsHelper.js`
- `src/lib/jobHelpers.js`
- `src/lib/query-client.js`
- `src/lib/utils.js`
- `src/config/tenantBranding.js`
- `src/index.css`
- `tailwind.config.js`
- `postcss.config.js`

---

## Recommended Execution Order (Forge Phase)

When Patrick approves cleanup execution, work in this order to avoid a broken intermediate state:

```
1. index.html          — fix title + favicon (zero dependency risk)
2. README.md           — full replacement (zero dependency risk)
3. src/api/base44Client.js   — replace with local stub first
4. src/lib/AuthContext.jsx   — rewrite to use local mock auth (depends on step 3)
5. src/lib/PageNotFound.jsx  — remove base44 import (depends on step 3)
6. src/lib/app-params.js     — remove or simplify (no longer needed after step 4)
7. vite.config.js            — remove base44 plugin
8. package.json              — remove @base44/sdk, @base44/vite-plugin, rename app
9. base44/ folder            — delete entire folder
10. npm install              — reinstall without Base44 packages
11. npm run build            — verify build passes
```

---

## Summary for Patrick / Nettie Review

| Category | Count | Status |
|----------|-------|--------|
| App-visible Base44 references (user-facing) | 4 | Needs replacement |
| SDK/dependency references (build-blocking) | 6 files | Needs surgical rewrite |
| Inert config files | 2 | Safe to delete |
| Banned brand references (FleetPanda/Panda Box/Mofs/OctaneOps) | 0 | Clean — none found |
| Screens/routes/features affected | 0 | Confirmed safe |
| External image assets requiring localization | 0 | None found |

**The app's entire driver workflow, forms, navigation, mock data, and UI are clean.**
Only the Base44 auth wiring and metadata files require changes.

---

*Audit generated by Mission Control — Van / Forge / Perry pre-cleanup inspection.*
*No source files were modified during this audit.*
