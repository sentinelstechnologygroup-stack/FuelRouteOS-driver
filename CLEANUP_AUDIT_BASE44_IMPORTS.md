# FuelRouteOS Driver — Base44 Import Audit
**Phase:** 2 — Project Audit
**Status:** Read-only scan. No files modified.
**Authority:** Nettie / Van / Perry (Mission Control — safe read-only)

---

## Commands Run

```bash
grep -n "import.*from|require(" \
  src/lib/AuthContext.jsx \
  src/lib/PageNotFound.jsx \
  src/api/base44Client.js \
  src/lib/app-params.js \
  vite.config.js

grep -rn "from '@base44|from \"@base44|require.*base44" \
  src/ vite.config.js
```

---

## Results — All @base44 Package Imports

### `src/api/base44Client.js`

| Line | Import | Classification |
|------|--------|----------------|
| 1 | `import { createClient } from '@base44/sdk'` | **Package import — must be replaced** |
| 2 | `import { appParams } from '@/lib/app-params'` | Internal import — stays until app-params is removed |

**Role of this file:** Creates and exports the `base44` client object used by `AuthContext` and `PageNotFound`. This is the root of the Base44 auth dependency chain. Replacing this file breaks the chain for all consumers.

**Replacement plan:** Replace entire file with a local mock auth stub that exports a compatible `base44` shape, OR remove it entirely after `AuthContext` and `PageNotFound` are updated to no longer import from it.

---

### `src/lib/AuthContext.jsx`

| Line | Import | Classification |
|------|--------|----------------|
| 2 | `import { base44 } from '@/api/base44Client'` | **Source import — must be removed** |
| 3 | `import { appParams } from '@/lib/app-params'` | Internal import — remove when app-params is cleaned |
| 4 | `import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client'` | **Package import — must be removed** |

**Lines using Base44 SDK at runtime:**
- Line 96: `const currentUser = await base44.auth.me()` — remote auth call
- Line 123: `base44.auth.logout(window.location.href)` — remote logout
- Line 126: `base44.auth.logout()` — remote logout (no redirect)
- Line 132: `base44.auth.redirectToLogin(window.location.href)` — redirect to Base44 login

**Role of this file:** Controls entire app loading gate (`isLoadingAuth`, `isLoadingPublicSettings`). If Base44 servers are unavailable, the app spinner never resolves. This is the highest-priority replacement target.

**Replacement plan:** Rewrite to local mock auth. Keep exact context shape (`useAuth()` hook, `logout()`, `navigateToLogin()`, all state fields). App screens and routing do not need to change — they consume the context shape, not the implementation.

---

### `src/lib/PageNotFound.jsx`

| Line | Import | Classification |
|------|--------|----------------|
| 2 | `import { base44 } from '@/api/base44Client'` | **Source import — must be removed** |
| 3 | `import { useQuery } from '@tanstack/react-query'` | Legitimate dependency — stays |

**Lines using Base44 SDK at runtime:**
- Line 14: `const user = await base44.auth.me()` — used to show admin-only note on 404 page

**Role of this file:** 404 page. The Base44 auth call here only gates an "Admin Note" box that tells admins "the AI hasn't implemented this page yet." This admin note is Base44-specific and has no value in the sanitized app.

**Replacement plan:** Remove `base44` import and the `useQuery` block. Remove the admin note section. Keep the 404 display layout, page text, and Go Home button entirely intact.

---

### `vite.config.js`

| Line | Import | Classification |
|------|--------|----------------|
| 1 | `import base44 from "@base44/vite-plugin"` | **Build config import — must be removed** |
| 9 | `base44({ ... })` in plugins array | **Build plugin — must be removed** |
| 10–11 | Comment referencing `@base44/sdk` legacy imports | **Comment — remove with plugin** |

**Role:** The `@base44/vite-plugin` adds a backend proxy, HMR notifier, navigation notifier, analytics tracker, and visual edit agent. None of these are needed in the standalone app. Removing it eliminates the build-time warning and the Base44 runtime injection.

**Replacement plan:** Remove the `base44` import and `base44({...})` from the plugins array. Keep `react()` plugin and any path alias configuration. The build will be cleaner and faster.

---

## Results — Internal Base44 References (no @base44 package)

### `src/lib/app-params.js`

| Line | Reference | Classification |
|------|-----------|----------------|
| 13 | `` const storageKey = `base44_${toSnakeCase(paramName)}` `` | **Internal string — must be removed** |
| 39 | `storage.removeItem('base44_access_token')` | **Internal string — must be removed** |
| 43 | `import.meta.env.VITE_BASE44_APP_ID` | **Env var reference — remove** |
| 47 | `import.meta.env.VITE_BASE44_FUNCTIONS_VERSION` | **Env var reference — remove** |
| 48 | `import.meta.env.VITE_BASE44_APP_BASE_URL` | **Env var reference — remove** |

**Role of this file:** Reads Base44-specific URL params and localStorage keys (`base44_access_token`, `base44_app_id`, etc.). This is only used by `base44Client.js` and `AuthContext.jsx`. Once both are replaced, `app-params.js` has no callers and can be removed entirely.

**Replacement plan:** Remove file entirely after `AuthContext.jsx` and `base44Client.js` are rewritten. The app already uses `fros_` prefixed localStorage keys (in `appContext.jsx`) for all its own state. No equivalent replacement is needed.

---

## Summary by Classification

### A — Source imports that must be replaced (blocking)

| File | Package/Import | Priority |
|------|---------------|----------|
| `src/api/base44Client.js` | `@base44/sdk` (createClient) | P1 — root of chain |
| `src/lib/AuthContext.jsx` | `@/api/base44Client` + `@base44/sdk/dist/utils/axios-client` | P1 — app loading gate |
| `src/lib/PageNotFound.jsx` | `@/api/base44Client` | P2 — 404 page only |

### B — Vite/plugin/config references (build-level)

| File | Reference | Priority |
|------|-----------|----------|
| `vite.config.js` | `@base44/vite-plugin` import + plugin usage | P1 — remove after source imports fixed |

### C — Package/runtime dependencies (package.json)

| Package | Used by | Priority |
|---------|---------|----------|
| `@base44/sdk` | `base44Client.js`, `AuthContext.jsx` | P1 — remove after source is clean |
| `@base44/vite-plugin` | `vite.config.js` | P1 — remove after vite config is clean |

### D — Internal strings (no package dependency)

| File | Content | Priority |
|------|---------|----------|
| `src/lib/app-params.js` | `base44_` localStorage keys, `VITE_BASE44_` env vars | P2 — remove after AuthContext replaced |

### E — False positives / safe to ignore

| File | Content | Notes |
|------|---------|-------|
| `src/utils/index.ts` | `createPageUrl` | Not a Base44 import — just a URL helper. No Base44 string in content. |
| `package-lock.json` | Many `@base44` entries | Lock file — auto-regenerated after `npm install`. Do not manually edit. |

---

## Safe Removal Order (Forge Phase — awaiting Patrick approval)

```
Step 1: src/api/base44Client.js         — replace with local stub
Step 2: src/lib/AuthContext.jsx          — rewrite to local mock auth
Step 3: src/lib/PageNotFound.jsx         — remove base44 import + admin note block
Step 4: src/lib/app-params.js            — remove entire file (no callers after steps 1–3)
Step 5: vite.config.js                   — remove @base44/vite-plugin
Step 6: package.json                     — remove @base44/sdk and @base44/vite-plugin
Step 7: npm install                      — regenerate package-lock without base44
Step 8: npm run build                    — verify build still passes
Step 9: base44/ folder                   — delete (inert config, no app references)
```

**DO NOT skip steps or re-order.** Removing packages (Step 6) before source imports are replaced (Steps 1–5) will break the build.

---

## Files Confirmed Clean (zero Base44 imports)

All 35 page files, all driver components, all branding components, all UI components, mockData.js, driverContext.jsx, appContext.jsx, branding.js, mapsHelper.js, jobHelpers.js, tenantBranding.js, index.css — **zero Base44 references.**

---

*Audit generated by Mission Control — Van / Forge / Perry.*
*No source files were modified during this audit.*
