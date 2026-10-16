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

## Commits

- [fc07131](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fc071312db5bc106977928dc96b7a082c9db1cb8)
- [49e24af](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/49e24af7ea4dec01c4d173fcdc4d9ddc18fffe8f)
