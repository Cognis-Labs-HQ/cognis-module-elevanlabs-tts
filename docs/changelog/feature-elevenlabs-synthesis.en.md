# Shared Speech Integration

**Feature Branch:** feature-elevenlabs-synthesis

## Usage

Move ElevenLabs synthesis into its own configurable module. Study uses optional per-language voices for saved global cards, while private and classroom cards accept bounded uploads and microphone recordings. Preserve continuous sentence composition as a fallback using existing constituent recordings. Administrators can regenerate global audio while editing.

## Fix Study enablement

Advance the actual English and Japanese content-pack versions when removing bundled recordings. Complete unrelated module reconciliation before reporting a failed activation so consent routes retain their registered flows.

## Provider artwork and CLI

Use the official ElevenLabs logo as a sharp SVG icon and a Cognis/ElevenLabs composite banner. Rename release files to match the declared feature branch. The installed `cognisctl modules:elevenlabs-tts:voices` command discovers voices through the authenticated public configuration API.

## Configuration boundary checks

Log malformed configuration requests without including their contents, reject oversized bodies with HTTP 413, and distinguish invalid settings from provider failures. Remove the hardcoded default test phrase. Preserve all existing developer-documentation headings.

## Honor explicit languages

Use Flash v2.5 for explicit supported language requests, preserve English IPA synthesis, and reject unsupported language codes before provider calls.

## Keep previews transient

Exclude test phrases from persisted settings, remove previously stored preview text on load, and reject incomplete configuration without changing saved values.

## Disable operational speech flows

Load a configuration-only service while disabled. Administrator voice discovery and test previews remain available; the general synthesis flow is not registered.

## Bound and release provider responses

Allow up to 64 MiB of MP3 audio for accepted long text. Cancel error and invalid-media response bodies before throwing stable errors.

## Credential storage prerequisite

The existing host concealed-value contract masks configuration responses but does not expose an opaque-reference credential store. Secure host-backed persistence remains open in [Cognis #515](https://github.com/Cognis-Labs-HQ/Cognis/issues/515); the API key is still stored in the configuration database.

## Publish speech without privilege

Publish `elevenlabs-tts:synthesis` within the module-owned namespace and remove the privileged flag. English and Japanese Study resolve this capability through ctx using their existing optional module dependency. The Study bridge receives the live capability getter from its caller, preserving provider disable/re-enable and configured voice handling.

## Commits

- [fc07131](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fc071312db5bc106977928dc96b7a082c9db1cb8)
- [49e24af](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/49e24af7ea4dec01c4d173fcdc4d9ddc18fffe8f)
- [fa92c9b](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fa92c9b607e5a21abc2db3b63c231fa32888b378)
- [dd89029](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/dd890299216d6f2ebe0fa6caf41103f64cfcde8f)
- [0f0f782](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/0f0f782c697f80b86c1836da649172d47c3d4108)
