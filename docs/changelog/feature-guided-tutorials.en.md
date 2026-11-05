# Guided tutorial

**Feature Branch:** feature-guided-tutorials

## Technical Specification

The play points administrators to this module’s marketplace card through the host’s public module-target capability. It never reads or changes credentials.

The module registers its own play and localized strings through ctx. The host owns the catalog, callouts, arrows, spotlight, keyboard and pointer controls, guarded SPA navigation and accessibility. Closing a tutorial, navigating away, losing access or disabling the module releases the session. Failed provider mounting rolls back its registrations.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

## Page-bound First Visits

The host owns callouts, arrows, spotlight, accessibility and the shared floating action menu. First-time runs offer Next throughout, without Cancel or Skip. Replays offer Cancel with `btn-cancel`. Completion is stored per account in the browser. Navigation, access loss and provider removal release the session; failed mounts roll back registrations.

## Actionable Tutorial Copy

Tutorial steps focus on the controls and tasks available on the page, without unrelated reassurances about permissions or actions the guide does not perform.

## Commits

- [8a833d3](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8a833d311d6081e5f334759ebdeca75284117e80)
- [8e04486](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8e044869c477a4bcd7c9326f5495ddb77c5b142f)
- [29faa2b](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/29faa2b205e9438ba21114715dc348bc921e2db6)
