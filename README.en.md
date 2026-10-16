# Cognis external module template

**English** · [Deutsch](README.de.md) · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Create every new external Cognis module from this repository. The installable showcase demonstrates UI, API, database, CLI, capabilities, flows, localization, lifecycle tests and package integrity. Replace its example identity and content while retaining the contributor standard and checks.

## Start here

```sh
npm install
npm test
npm run check:manifest
```

Install the repository as a Cognis module source, review its permissions, enable it, then open `/showcase` or run `cognisctl modules:module-template:list`.

## Architecture map

| Path            | Responsibility                                                                            | Key lesson                                               |
| --------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `manifest.json` | Identity, compatibility, capabilities, entrypoints, store metadata, immutable file hashes | UUIDs are dependencies; IDs are human-readable           |
| `bootstrap.js`  | Sole host integration point                                                               | Register through `ctx`; never import Cognis internals    |
| `routes.json`   | Up-front page access declaration                                                          | The host validates protected routes before activation    |
| `api/index.js`  | Authenticated HTTP boundary and orchestration                                             | Validate input and delegate persistence                  |
| `api/store.js`  | Portable database-executor commands and schema                                            | Never bind a module to a database driver                 |
| `api/ui.js`     | Static assets, SPA route, navigation                                                      | Host registration makes disable/uninstall cleanup scoped |
| `ui/`           | Browser entrypoint, styling, four locale bundles                                          | Set `ui.stringsBaseUrl`; use host routes/toasts          |
| `cli/index.js`  | `cognisctl` extension                                                                     | CLI calls the public API instead of bypassing it         |
| `docs/`         | Contributor deep dives                                                                    | Explain contracts and safe extension patterns            |
| `scripts/`      | Package integrity checks                                                                  | Every shipped file has a SHA-256 digest                  |

## Lifecycle and boundaries

1. Cognis validates `manifest.json`, component dependencies, capability requirements, routes, and file digests.
2. Enabling calls `bootstrapModule(ctx)`. The module registers UI/API contributions, publishes a capability, and extends a flow.
3. API handlers authenticate and validate. The store owns schema and persistence through `db:executor`.
4. UI and CLI consume the same HTTP API. Other components may consume `module-template:listItems` through `ctx`.
5. Scoped registrations are removed when disabled. Add and return an explicit disposer if you create timers, listeners, sockets, or other resources outside scoped registrations.
6. Uninstalling calls `uninstallModule(ctx, { deleteContent })`; the template deletes its database rows only when the administrator requests content deletion.

Cross-component behavior belongs in **capabilities** (a callable contract) or **flows** (ordered extension stages). Do not reach into Cognis, gateways, or sibling module source trees. Required component links in `requires` are UUIDs; runtime contracts belong in `requiresCapabilities`.

## Forking this template

1. Choose a stable readable ID and generate a new UUID once. Never reuse this template UUID in a published fork.
2. Rename package, command, API/static paths, DB table prefix, localization namespace, flow extension IDs, and capability keys.
3. Replace publisher/repository/support metadata and artwork.
4. Keep manifest/package/lock versions identical, and set `ui.stringsBaseUrl` in the manifest to the module’s locale bundle base URL.
5. Add only capabilities the module truly needs, and keep route access least-privileged.
6. Run `npm run manifest:hashes` last, then `npm run check` and `git diff --check`.

See [`docs/index.en.md`](docs/index.en.md) before implementing a production module; equivalent German, Indonesian, and Japanese references live beside it.

## Contributor quality checks

This template includes the same automated contributor guardrails used by the Jitsi Meet module: Prettier formatting, readability limits, external-module structural checks, documentation-template parity, and ambiguous-name checks.

```sh
npm install
npm run lint
npm test
npm run check:manifest
git diff --check
```

New contract documentation can start from the localized templates in `.github/DOCUMENTATION_TEMPLATE.<language>.md`. Keep all four template variants structurally synchronized.
