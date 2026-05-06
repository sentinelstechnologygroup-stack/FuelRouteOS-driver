# FuelRouteOS Driver — Phase 3 Cleanup Report
**Authority:** Patrick / Nettie / Mission Control
**Working directory:** `FuelRouteOS_driver_clean/`
**Original preserved at:** `FuelRouteOS_base44_original_backup/` — untouched

---

## BATCH 1 — README + Metadata Cleanup

**Status: PASSED**
**Date: 2026-05-06**
**Authority: Van / Forge**

### Files Changed

| File | Change | Type |
|------|--------|------|
| `README.md` | Full replacement with approved SDL/FuelRouteOS README | Metadata only |
| `index.html` | Title changed: `Base44 APP` → `FuelRouteOS Driver` | Metadata only |
| `index.html` | Favicon changed: `https://base44.com/logo_v2.svg` → `/favicon.svg` (local) | Metadata only |
| `public/favicon.svg` | Created — fuel nozzle SVG icon in FuelRouteOS brand blue (#2563EB) | New file |
| `package.json` | `name` field: `base44-app` → `fuelrouteos-driver` | Metadata only |

### No App Behavior Changes

- Zero source files modified
- Zero routes changed
- Zero components changed
- Zero pages changed
- Zero dependencies added or removed

### Build Command

```bash
npm run build > /tmp/b1_build.txt 2>&1; echo "EXIT:$?"
```

### Build Output

```
> fuelrouteos-driver@0.0.0 build
> vite build

[base44] Proxy not enabled (VITE_BASE44_APP_BASE_URL not set)
```

### Exit Code: 0

### Result

> **Batch 1 passed. No app behavior changes detected.**

Remaining Base44 build warning (`[base44] Proxy not enabled`) is expected — the Base44 Vite plugin is still present and will warn until Batch 2 removes it. This does not affect the build.

---

## BATCH 2 — Base44 Runtime Source Isolation

**Status: IN PROGRESS**
**Target files: 5**
**Risk level: MEDIUM (path alias dependency discovered — see critical note)**

### Critical Discovery: `@/` Path Alias

The `@/` path alias (e.g. `import { useDriver } from "@/lib/driverContext"`) is used in **every page and component** in the app — 43+ files.

This alias is currently defined ONLY in `jsconfig.json` (for IDE support). It is NOT configured in `vite.config.js`. The `@base44/vite-plugin` is injecting this alias at Vite build time as one of its internals.

**If `@base44/vite-plugin` is removed from `vite.config.js` without first adding `resolve.alias` to the config, the build will immediately fail with module resolution errors across every single file in the project.**

**Forge solution:** When rewriting `vite.config.js`, add `resolve.alias` explicitly before removing the base44 plugin. This is a one-line safe addition using Vite's standard API.

```js
// Safe alias restoration — standard Vite pattern
import { fileURLToPath, URL } from 'url'

resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

This must be in the new `vite.config.js` or the build breaks completely.

---

### Batch 2 — File-by-File Replacement Plan

#### File 1: `src/api/base44Client.js`

**Current:** Imports `createClient` from `@base44/sdk`, creates and exports the `base44` SDK client object used by `AuthContext.jsx` and `PageNotFound.jsx`.

**Replacement:** After `AuthContext.jsx` and `PageNotFound.jsx` are rewritten to no longer import this file, replace the contents with a clearly documented stub that:
- Exports nothing functional
- Documents why the file was replaced
- Does not import `@base44/sdk`

**Order:** Replace this file LAST among the source files — only after AuthContext and PageNotFound no longer reference it. Otherwise the stub breaks their imports.

**Preserved:** Nothing in this file is app logic worth keeping. It is pure Base44 SDK wiring.

---

#### File 2: `src/lib/AuthContext.jsx`

**Current:** Controls the entire app loading gate. Uses `base44.auth.me()`, `base44.auth.logout()`, `base44.auth.redirectToLogin()`, and `createAxiosClient` from the Base44 SDK. Makes remote API calls to Base44 servers on every app load. If servers are unavailable, the spinner never resolves.

**Replacement:** Local mock auth context. Exact same exported shape — every consumer (`App.jsx`, `ProtectedRoute.jsx`, `Profile.jsx`, etc.) calls `useAuth()` and expects the same fields.

**Context shape to preserve exactly:**
```js
{
  user,               // null in mock mode (driver data comes from driverContext/mockData)
  isAuthenticated,    // false until login form submits
  isLoadingAuth,      // false immediately (no remote call)
  isLoadingPublicSettings, // false immediately (no remote call)
  authError,          // null (no auth errors in local mode)
  appPublicSettings,  // null (not used in local mode)
  authChecked,        // true immediately
  logout,             // resets state, navigates to "/"
  navigateToLogin,    // navigates to "/"
  checkUserAuth,      // no-op
  checkAppState,      // no-op
}
```

**Result for App.jsx:** `isLoadingPublicSettings = false` and `isLoadingAuth = false` and `authError = null` → the spinner is skipped and the app renders routes immediately. Login is handled by `DriverLogin.jsx` which already navigates directly via `useNavigate()` with no auth dependency.

**Preserved:** All state field names, all function names, `useAuth()` hook, `AuthProvider` wrapper — all identical. Zero downstream changes required.

**Removes:** Remote API calls, Base44 SDK imports, `appParams` import, `createAxiosClient` import.

---

#### File 3: `src/lib/PageNotFound.jsx`

**Current:** Imports `base44` from `@/api/base44Client`, runs `base44.auth.me()` via `useQuery` to check if the user is an admin, and conditionally shows a Base44-specific admin note: *"The AI hasn't implemented this page yet. Ask it in the chat."*

**Replacement:** Remove the `base44` import, remove the `useQuery` block, remove the admin note section. Keep the full 404 layout, Go Home button, and page text intact.

**The admin note is Base44-specific product copy** ("Ask the AI in the chat") — it has no meaning in FuelRouteOS and should not appear.

**Preserved:** 404 page title, 404 display number, page not found message, Go Home button, all styling.

**Removes:** `base44` import, `useQuery` import (no longer needed on this page), admin note block.

---

#### File 4: `src/lib/app-params.js`

**Current:** Reads Base44-specific URL parameters and localStorage keys (`base44_access_token`, `base44_app_id`, `VITE_BASE44_APP_ID`, etc.). Only imported by `base44Client.js` and (indirectly) `AuthContext.jsx`.

**After Batch 2:** This file will have zero callers. AuthContext no longer imports it. base44Client is replaced.

**Replacement:** Replace contents with an empty / documented stub. Do not delete (deletion requires separate approval). The file slot is preserved; it just no longer does anything.

**Preserved:** File exists at same path. No downstream impact.

**Removes:** All Base44 localStorage key logic, all `VITE_BASE44_*` env var reads.

---

#### File 5: `vite.config.js`

**Current:** Imports `@base44/vite-plugin`, uses it as the first plugin (injects proxy, HMR notifier, analytics, visual edit agent, AND the `@/` path alias at build time).

**Replacement:** Remove Base44 plugin. Add explicit `resolve.alias` for `@/` (restoring what the plugin was injecting). Keep `react()` plugin and `logLevel: 'error'`.

**New vite.config.js:**
```js
import { fileURLToPath, URL } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

**Risk:** LOW once alias is in place. HIGH if alias is omitted.
**Preserved:** `logLevel: 'error'`, `react()` plugin, full build behavior.
**Removes:** `@base44/vite-plugin` import and usage, Base44 proxy/analytics/HMR injection.

---

### Batch 2 — Execution Log (continued)

| Step | File | Status |
|------|------|--------|
| 1 | `vite.config.js` | ✅ PASSED |
| 2 | `src/lib/AuthContext.jsx` | 🔄 IN PROGRESS |
| 3 | `src/lib/PageNotFound.jsx` | ⏳ Pending |
| 4 | `src/lib/app-params.js` | ⏳ Pending |
| 5 | `src/api/base44Client.js` | ⏳ Pending |

Build must pass after every step. If any step fails, stop and report before continuing.

---

## BATCH 3 — Package Cleanup (Planned)

**Status: PLANNED — awaiting Batch 2 completion + Patrick approval**

See `DEPENDENCY_CLEANUP_PROPOSAL.md` for full package list.

## BATCH 4 — Public Image Folder Structure (Planned)

**Status: PLANNED — awaiting Batch 3 completion**

## BATCH 5 — Post-Cleanup Validation (Planned)

**Status: PLANNED — awaiting all batches**

---

*Report maintained by Mission Control — Van / Forge / Warden.*
