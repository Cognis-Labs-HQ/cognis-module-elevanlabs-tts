# Guided tutorial

**Feature Branch:** feature-guided-tutorials

## Technical Specification

The play points administrators to this module’s marketplace card through the host’s public module-target capability. It never reads or changes credentials.

The module registers its own play and localized strings through ctx. The host owns the catalog, callouts, arrows, spotlight, keyboard and pointer controls, guarded SPA navigation and accessibility. Closing a tutorial, navigating away, losing access or disabling the module releases the session. Failed provider mounting rolls back its registrations.

Provider tests check the public contract, all four translations, availability rules, rollback and rejection of unsupported host versions.

## Commits

- [8a833d3](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/8a833d311d6081e5f334759ebdeca75284117e80)
