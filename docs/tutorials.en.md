# Guided tutorial

This module binds its introductory play to its own page through `ui:tutorials`. The first permitted visit starts it automatically; the question-mark SVG beside the page title replays it. The host must provide the version-one page-bound tutorial contract.

## Usage Examples

The administrator guide starts on the ElevenLabs detail page. Clicking Settings opens a branch for the API key, default voice, voice discovery, test phrase, audio generation and optional playback. Next without opening Settings bypasses the branch. Controls are resolved through the host’s public module-target contract, never by inspecting foreign popup markup. Tutorial completion and credentials remain unchanged by registration.

## Technical Specification

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

The shared host provides queued floating actions. First visits offer Next/Finish without Cancel or Skip; replays offer Skip before the last visible step. Restart Tutorial appears after the first visible step. Completion survives content updates. Explicit highlightNext flags enable only a breathing animation for explanatory steps; reduced motion disables it. Each stage highlights a distinct rendered control in UI order. Guides stay bound to the current view, handle empty and optional states, and release their resources on navigation or owner removal.
