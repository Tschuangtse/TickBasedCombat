# Tick Based Combat

A tick-based alternative combat timeline for Foundry Virtual Tabletop.

This branch/release is the Foundry VTT V14 / ApplicationV2 port of the original **Tick Based Combat** module.

## Compatibility

- Foundry Virtual Tabletop: V14
- Verified: 14.367
- Module version: 0.3.9

## Installation

In Foundry VTT Setup:

1. Open **Add-on Modules**.
2. Click **Install Module**.
3. Paste this URL into **Manifest URL**:

   `https://github.com/Tschuangtse/TickBasedCombat/releases/latest/download/module.json`

4. Click **Install**.

## Notes

- The module keeps the original package ID `tick-combat` so existing world flags remain accessible.
- Legacy combatant data stored as JSON strings is still supported.
- This V14 port should initially be tested on a copy of a world. The automated checks do not replace an in-world function test.

## Changes in 0.3.7

- Complex-action titles are centered on combatant cards.
- The duration field has dedicated up/down buttons so the controls remain visible even when Foundry hides native number-input arrows. It starts at 8, steps by 8, and still accepts direct typing.

## Changes in 0.3.6

- Use **Complex action** with exactly one selected, active combat token that you own (or any eligible token as GM).
- Enter only the action name and total duration: at least 8 ticks, in multiples of 8, using the number field's arrows or direct typing.
- Beginning the action adds 8 ticks to the combatant and records 8 ticks of progress. The card shows the action name, progress such as **24/32 ticks**, and **Next 8 ticks** instead of normal tick input and waiting controls.
- The next interval can only be applied at tick 0. Committing the final interval immediately restores the normal card, with the last 8 ticks still scheduled. An 8-tick action therefore returns to the normal card immediately after starting.
- Progress is saved with the combatant and synchronized through Foundry flags. The display limit and elapsed tick counter continue to use the full timeline.

## Changes in 0.3.5

- Fixed elapsed tick counting after advancing combatants: embedded Combatant updates and world-level Combat updates now use separate operation objects, preventing Foundry from treating the Combat itself as an embedded document.
- Tracker controls, encounter labels, initiative fields, tooltips, and validation messages now default to English.

## Changes in 0.3.4

- Removed the initiative context menu and its lifecycle error, which interrupted timeline redraws after starting combat or reopening the timeline.
- Initiative now uses a dice button beside each eligible combatant name. It disappears after combat starts; rerolling is allowed beforehand. The dialog uses whole-number inputs with visible up/down arrows and direct typing, and its outer content element satisfies V14's attribute restrictions.
- Opening the timeline restores minimized windows and brings the window to the front.
- Zoom changes update both the window scale and the toolbar label.
- Cards keep their content height in narrow/short windows. Columns have a fixed width, long names are truncated with a full-name tooltip, and excess content scrolls.
- The encounter selector is labeled and shown only when several encounters exist. Unnamed encounters use readable labels instead of internal document IDs.

## Features

- The Combat sidebar uses Tick Combat in place of the standard participant list and round/turn controls. GMs can create and select encounters there, and everyone can reopen the timeline.
- Every visible, undefeated combatant at tick 0 has a gold outline around its battlemap token. This does not change token selection, targeting, or permissions.
- Before combat starts, use the dice button beside an owned combatant name (or any combatant as GM). Enter **Reaction** and **Impairment**, both whole numbers starting at 0. Initial ticks are `30 - Reaction + Impairment - 1d6`. Results stay absolute until combat starts and may be rerolled before then.
- The timeline counter shows ticks elapsed since combat started. Advancing a group counts the shared time step once; waiting combatants do not block time. Manual corrections to earlier ticks never reduce elapsed time.
- Timeline scale now includes 50%. Drag the window corner to resize it, with a minimum of 360 × 220 layout pixels. Updates preserve the chosen size, and long content scrolls.
- Use the **All / Next 3** button or the client setting **Visible combatant tick groups** to show only the next three distinct active combatant tick positions. All ties are included, waiting combatants remain visible, and events up to the last visible position are shown. This filter does not affect time advancement.

### Development checks

Run `npm test` (or `node --test`) with Node.js. The tests use Foundry API doubles; they do not replace an in-world Foundry V14 check of rendering, permissions, and multiplayer behavior.

For the in-world function test, check the replacement sidebar and its popout; two simultaneous tick-0 tokens and their movement/visibility; initiative as GM and player before/after combat start; tied combatants and elapsed ticks; resize/scroll at 50% scale; and the 0, 0, 4, 7, 7, 9 display example.

## Repository

https://github.com/Tschuangtse/TickBasedCombat
