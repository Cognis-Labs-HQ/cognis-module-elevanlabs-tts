# External Module Template

Create every new external Cognis module from this repository. The installable showcase demonstrates UI, API, database, CLI, capabilities, flows, localization, lifecycle tests and package integrity. Replace its example identity and content while retaining the contributor standard and checks.

## Usage Examples

- Open `/showcase` after enabling the module to use its localized page-composer UI.
- Run `cognisctl modules:module-template:list` to consume the same authenticated API through the CLI.
- Resolve `module-template:listItems` through `ctx` instead of importing module internals.
- Extend the `module-template:listItems` flow through a named, removable stage.
- Disable and re-enable the module to verify that scoped registrations are repeatable.

## Technical Specification

The rules below aggregate the core runtime contract and patterns proven by adjacent Cognis modules.

### Repository and Manifest Contract

- One repository delivers one module. Keep `manifest.json`, `package.json`, `routes.json`, and `bootstrap.js` at its root.
- Preserve the UUID forever and use UUIDs for required components. Keep manifest, package, and lockfile versions synchronized.
- Declare exact repository-relative entrypoint and asset paths. Keep `routes.json` an array and `package.json` an ES module package.
- Set `ui.stringsBaseUrl`, namespace locale keys with lowercase period-delimited words, and provide German, English, Indonesian, and Japanese key parity.
- Declare only necessary routes, capabilities, dependencies, and permissions. Regenerate `manifest.files` last. Exclude the manifest, `docs/changelog/`, the optional root `README.md` compatibility alias, and every symbolic link or other non-regular entry. Localized README files remain regular packaged files.

### Isolation and Lifecycle

- `bootstrap.js` orchestrates all host integration through its scoped `ctx`; it does not contain feature implementation or import Cognis internals.
- Capabilities are neutral contracts. Unprivileged modules prefix contributed capability and flow IDs with their manifest ID; colon-delimited segments use camel case. Optional components are discovered by capability.
- Meaningful orchestration uses named flows and stable, removable stages. Route handlers validate and coordinate while capabilities perform provider-specific work.
- A disposer or `teardownModule` removes unscoped timers, listeners, sockets, and scripts. `uninstallModule(ctx, { deleteContent })` preserves external content unless deletion was explicitly requested.
- Verify install, enable-disable-enable, and uninstall. No route, asset registration, UI contribution, capability, or flow hook may leak across cycles.

### UI and Host Ownership

- Compose pages with the host page composer and navigate through the host router. Use links for navigation and buttons for actions.
- A module styles only module-owned descendants of its mount root. It does not mutate the shell, `document.body`, `document.head`, or host-owned classes.
- Obtain shared UI primitives and styles from `ui:reuse`; load runtime scripts through `ui:resourceLoader` and dispose their handles.
- Use host toast, error/decision popup, timestamp, theme, font, avatar, and focus contracts. Do not use browser dialogs, page reload navigation, arbitrary status nodes, CSS comments, or copied host CSS.
- Localize visible and accessibility text in all four XML bundles. Prefer themeable SVG assets to emoji and platform glyphs.

### API, Data, and Configuration

- Validate, normalize, authenticate, and authorize at the boundary before business logic. Return stable errors without internal details.
- Keep storage behind ctx-provided executors and module-owned stores; parameterize queries and namespace schema objects. Never import a concrete driver.
- Do not invent a result limit when callers omit one. Validate explicitly requested limits without silently clamping them.
- Use manifest `ui.preferences` plus the module config API for administrator settings, not a second settings screen. Preserve config across disable/restart and never return stored passwords.
- Put user secrets in the host keyring. Generate identifiers and secrets with Web Crypto or Node Crypto, never `Math.random()`.
- Log state changes at `info`, caught failures at `error` with safe structured context, and uncaught failures as fatal. Intentional fallbacks are logged, never silent.

### Structure and Quality

- Keep server, browser, CLI, documentation, data, tooling, and artwork in `api/`, `ui/`, `cli/`, `docs/`, `data/`, `scripts/` or `tooling/`, and `assets/` respectively.
- Put genuinely cross-cutting layer-local code in `reuse/`; keep feature code near its owner and avoid `shared`, `utils`, `helpers`, and `common` directories.
- Keep files cohesive and at most 1000 lines. Prefer descriptive names, readable control flow, useful constraint comments, and no obsolete compatibility shims.
- Tests run standalone with local ctx fakes and cover public APIs, capabilities, flows, authorization, localization, lifecycle, and manifest integrity.

### Release Checklist

1. Review dependency UUIDs, required capabilities, route access, metadata, translations, artwork, and secret handling.
2. Synchronize the manifest, package, and lockfile versions for contract, code, schema, or API changes.
3. Run `npm install`, `npm run lint`, and `npm test`.
4. Run `npm run manifest:hashes` after the final shipped-file edit, then `npm run check:manifest` and `git diff --check`.
5. For non-template modules, add the four localized `docs/changelog/<branch>.<lang>.md` files and finish their commit provenance without digesting changelogs.

Start from this template for every new external module. Generate a new product UUID once, replace example metadata and namespaces, and retain AGENTS.md plus validation tools. Domain routes live in `api/routes/<domain>/`, styles in `ui/styles/`, markup in `ui/templates/`, and release notes in `docs/changelog/`. API reads and writes execute their registered stages; browser mounts use page composer and scoped navigation.

Entrypoints and artwork targets must be regular files inside the checkout, including their resolved paths. Validate these targets before inventory hashes. Developer documents describe public contracts and link manifests for release metadata. Preserve published flow-stage IDs. `mountWhenDirect(mount)` supplies the host navigation AbortSignal; check it after awaited initialization before creating UI resources.
