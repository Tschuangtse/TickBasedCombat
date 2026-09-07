# Tick Based Combat 0.3.0

First Foundry VTT V14 compatibility release.

## Changes

- Ported the timeline window to ApplicationV2 with HandlebarsApplicationMixin.
- Reworked UI actions away from legacy jQuery event handlers.
- Updated event/combatant editing to DialogV2.
- Updated Combat Tracker integration for the V14 DOM/ApplicationV2 environment.
- Preserved the module ID `tick-combat` for compatibility with existing world flags.
- Preserved support for legacy JSON-string combatant flags.
- Added V14-compatible manifest metadata and GitHub release URLs.
- Added defensive handling for missing token documents.
- Restricted global normalization to an active GM to reduce conflicting updates.

## Compatibility

- Minimum Foundry VTT: 14
- Verified Foundry VTT: 14.367
- Maximum: 14.999

This is a test/beta migration. Test it on a copy of an existing world before relying on it in a live session.
