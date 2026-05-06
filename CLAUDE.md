# Claude Project Instructions — FuelRouteOS Driver

## Mission Control Routing

Claude is not operating as a standalone coding assistant on this project.

```
Patrick → Nettie → Department Heads → Agents
```

**Nettie** — Command Coordinator / Chief of Staff
Owns routing, task order, preservation rules, approval flow, and final handoff structure.

**Van** — Chief Technology & Operations Officer
Owns technical execution, local project sanitation, Base44 dependency removal, Next.js prep, routing, file structure, and build stability.

**Perry** — Chief Security Officer
Owns security, data handling, legal/trust surfaces, dependency review, and no unsafe assumptions.

**Warden** — QA / Stability
Owns validation, regression protection, route testing, build testing, and "do not nuke the app" enforcement.

**Forge** — Build Engineer
Owns package cleanup, dependency replacement, component normalization, and build fixes.

**Blueprint** — Architecture
Owns Next.js folder system, app shell, navigation structure, tenant branding architecture, and future admin-dashboard readiness.

---

## Safe Commands

Claude may proceed without asking Patrick for any of the following:

- `ls`, `find`, `grep`, `cat`
- `sed` (read-only usage)
- `npm install`
- `npm run build`
- `npm run dev` (only when UI verification is needed)
- `npm audit` / reporting
- Reading files
- Writing audit reports and documentation files
- Creating backups
- Inspecting `package.json`
- Scanning for image references
- Scanning for branding references
- Scanning routes and components

---

## Commands Requiring Patrick Approval

Ask Patrick **before** any of the following:

- `rm` / delete of any file
- Mass file moves or renames
- Removing screens, features, forms, or functions
- Removing packages from `package.json`
- Replacing routing architecture
- `git commit`, `git push`, deployment
- Credential or environment variable changes
- Any destructive or irreversible action

---

## Preservation Doctrine

### DO NOT NUKE THE APP.

Do not delete:
- Screens or page files
- Forms or form logic
- Functions or workflow helpers
- Workflow logic or state management
- Mock data (`mockData.js`, `driverContext.jsx`)
- Universal Scan
- Sync Queue
- BOL / Pickup Confirmation
- POD / Delivery Confirmation
- Maps / geofence scaffolding
- Dispatch Chat
- Settings
- Legal / Trust pages
- Tenant branding config
- Client branding layer

If a feature is broken, **repair or isolate it**. Do not remove it unless Patrick explicitly approves.

Do not simplify by deleting useful workflow scaffolding.

---

## Product Rules

- **FuelRouteOS Driver** must remain an original product.
- Screenshots are workflow intelligence reference only — not design targets.
- Do not copy FleetPanda, Panda Box, or any competitor UI.
- No Base44 runtime dependency in production.
- **FuelRouteOS** is the product name.
- **Sentinels FleetOps** is the brand family.
- **Sentinels FleetOps Demo Carrier** is the default demo tenant.

---

## Bottom Nav Rule

There must be exactly one bottom navigation system:

```
Home | Today | Route | Scan | Sync
```

This is implemented in `src/components/driver/DriverBottomNav.jsx`.

The legacy `BottomNav.jsx` (Today / Route / Chat / Sync / Profile) must not be used in new navigation and should be deprecated when it is safe to do so.

Chat and Profile belong in the hamburger/file-stack menu, job action buttons, and settings routes — not in the bottom nav.

---

## Theme System Rule

Three themes only:
- **Day** — light mode
- **Night** — dark mode
- **Accessible** — high contrast

Managed by `AppContext` in `src/lib/appContext.jsx`. Do not add additional theme modes, color accessibility toggles, or separate mode systems.

---

## Tenant Branding Rule

All tenant/client branding must flow through:

- `src/config/tenantBranding.js` — single source of truth
- `src/lib/branding.js` — helper functions

Do not hardcode company names, phones, emails, logos, or accent colors in page files.

---

## Navigation / Maps Rule

All map navigation must use `src/lib/mapsHelper.js`:

- `buildMapsUrl(address, mapsApp)`
- Respects the user's selected maps app (Google / Apple / Waze / Ask)

Do not hardcode `maps.google.com` inline in page components. Use the helper.

---

## Build Baseline

Before any cleanup:
- `npm run build` **passed** (exit 0)
- Dist folder produced
- 16 npm vulnerabilities documented in `BUILD_ERRORS_INITIAL.md`
- Zero routing errors

After any cleanup phase, re-run `npm run build` and confirm it still passes before proceeding.

---

## Approval Boundary Routing

Claude must decide whether a command requires Patrick approval **before** surfacing the approval question.

### Nettie / Mission Control May Approve Without Patrick

The following are pre-approved under Nettie / Van / Perry authority:

- `grep`, `find`, `ls`, `cat`, read-only `sed`
- `npm audit`, `npm outdated`, `npm ls`, `npm explain`
- `npm install`, `npm run build`
- Source scans — branding, Base44, image URL, route, component
- Dependency import scans
- Writing markdown audit files
- Writing documentation files
- Creating backup folders
- Creating non-destructive reports
- Reading any file in the project

### Patrick Approval Required

Ask Patrick **before**:

- `rm` / delete of any file or folder
- `npm uninstall` — any package removal
- `npm update`, `npm audit fix`, `npm audit fix --force`
- Editing `package.json` or `package-lock.json`
- Mass file moves or renames
- Deleting screens, forms, functions, or features
- Removing or replacing routing architecture
- `git commit`, `git push`, deployment
- Credential or environment variable changes
- Any destructive or irreversible action

### Default Rule

- If **read-only** → proceed under Nettie.
- If **documentation-only** → proceed under Nettie.
- If **destructive** → ask Patrick.
- If **package-removal or architecture-changing** → ask Patrick.

Claude must not ask Patrick routine audit questions. Route routine safe actions through Nettie / Mission Control internally.

---

## Audit Files in This Project

| File | Contents |
|------|----------|
| `CLEANUP_AUDIT_EXTERNAL_URLS.md` | External URL scan results — no image assets found |
| `CLEANUP_AUDIT_BRANDING_REFERENCES.md` | Base44 / banned brand reference map |
| `BUILD_ERRORS_INITIAL.md` | Pre-cleanup build baseline |
| `CLEANUP_AUDIT_DEPENDENCIES.md` | Full dependency and package analysis |
| `CLEANUP_AUDIT_BASE44_IMPORTS.md` | All @base44 import locations and replacement plan |
| `CLEANUP_AUDIT_BASE44_REFERENCES.md` | Full Base44 string reference map across project |
| `DEPENDENCY_CLEANUP_PROPOSAL.md` | Proposed removal batches — awaiting Patrick approval |
| `FuelRouteOS_base44_original_backup/` | Unmodified original export — do not touch |
