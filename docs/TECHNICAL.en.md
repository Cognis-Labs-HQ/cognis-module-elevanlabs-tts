# Technical Reference

Public interfaces, configuration and lifecycle of ElevenLabs Speech.

## Interfaces

Configure the module from the administrator configuration popup, including while disabled. Enter an ElevenLabs API key, discover voices and choose the default voice, or enter its ID manually if discovery is unavailable. Generate test audio from the current, unsaved settings before saving. The API key is concealed on reads and survives restart and disable; deleting module content removes it.

## Configuration

The module manifest declares its supported settings and dependencies. Configure only the owning module or its declared authentication adapter through Administration; enabled and disabled entrypoints follow the manifest.

### Declared administrator fields

| Key        | Type       |
| ---------- | ---------- |
| `apiKey`   | `password` |
| `voiceId`  | `string`   |
| `testText` | `string`   |

## Behavior

The enabled module publishes `elevenlabs-tts:synthesis`. Call `synthesize({ text, language?, voiceId?, phonemes? }, signal?)` to receive `{ mediaType, data }`. Omitting `voiceId` uses the configured default. `revision` changes after configuration is saved so callers can invalidate their caches. English IPA phonemes use SSML with `eleven_turbo_v2`. Explicit language requests use `eleven_flash_v2_5`, which honors supported language codes; unsupported codes are rejected before requesting speech. Without a language, `eleven_multilingual_v2` detects it automatically. Requests accept at most 5000 characters and return bounded MP3 audio. Provider requests use a fixed HTTPS origin, reject redirects, and have a timeout; teardown cancels outstanding requests. Logs exclude API keys, text and audio.

Configuration routes use `/api/v1/modules/elevenlabs-tts/config`: administrator-only GET, PUT and DELETE, plus POST `/voices` (paginated discovery) and `/test` (audio preview). Both actions accept current form values, retaining the concealed stored key when omitted. Only configuration routes run while disabled. Persistence uses `db:executor`; no database driver is bundled.

The speech capability has no Study-specific policy. Callers enforce authorization and namespace rules before requesting speech. Cognis Study generates speech only for saved global cards; private and classroom cards accept recordings or compose existing constituent audio. This repository contains no language content packs.

`npm install` · `npm run lint` · `npm test` · `npm run manifest:hashes` · `npm run check:manifest`

Discover voices from the installed CLI with `cognisctl modules:elevenlabs-tts:voices`. It uses the saved configuration and authenticated administrator-only `/config/voices` route, including provider pagination. The CLI help contract currently accepts literal descriptions; runtime speech and configuration messages remain localized by the host. Module artwork uses the ElevenLabs mark from its official website and a Cognis/ElevenLabs composite banner.

Audio responses are bounded to 64 MiB for the 5000-character input limit at 128 kbps. Configuration saves require a nonempty API key and default voice after merging unchanged masked values. Preview phrases are transient: saving settings excludes them, reads return an empty phrase, and loading earlier configuration removes stored preview text. Disabled configuration registers only administration flows and never registers `elevenlabs-tts:synthesize`. Rejected provider responses cancel their bodies before returning stable errors.

The host concealed-value contract masks credentials on API reads; it does not provide encrypted credential storage or an opaque-reference secret-store capability. Operational API keys remain in the module configuration database. The host-backed storage prerequisite is tracked in [Cognis #515](https://github.com/Cognis-Labs-HQ/Cognis/issues/515).

`elevenlabs-tts:synthesis` uses the module-owned namespace; the manifest requests no privileged host access. English and Japanese Study resolve this capability through ctx using their existing optional module dependency. The Study bridge receives the live capability getter from its caller, preserving provider disable/re-enable and configured voice handling.

The published capability reports live `configured` readiness. Study enables automatic speech only after both the API key and default voice are saved. If ElevenLabs is absent, disabled, or unconfigured, language registration still succeeds and uploaded audio and composite fallback remain available; no synthesis is requested.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.

## Security

Provider transport uses fixed HTTPS destinations, rejects redirects and bounds generated audio. Configuration reads conceal the API key, but the key remains in the configuration database: concealment does not imply encrypted secret storage. Synthesis callers enforce content authorization. Logs exclude keys, input text and audio; preview text is transient and is not saved.

## Reference

- [manifest.json](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/blob/HEAD/manifest.json)
- [bootstrap.js](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/blob/HEAD/bootstrap.js)
- [Cognis](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/modules/external/TECHNICAL.en.md)

### Naming validation

`npm test` checks binding names with the local syntax-tree detector, including bootstrap, scripts, tests and fixtures. Parsing errors fail validation. The detector regression fixtures cover declarations, parameters, private members, TypeScript assertions and legitimate type-only names. See the [host naming standard](https://github.com/Cognis-Labs-HQ/Cognis/blob/HEAD/src/docs/standard/TECHNICAL.en.md#binding-names) for the shared policy. Conventional vocabulary such as `args`, `db` and LDAP `dn` is accepted as standalone names. Composite identifiers, including upstream types and methods, use expanded words such as `DatabaseExecutor`, `createDatabaseExecutor` and `baseDistinguishedName`; owned APIs use one canonical name across declarations, exports and callers. Naming-only export aliases fail validation.
