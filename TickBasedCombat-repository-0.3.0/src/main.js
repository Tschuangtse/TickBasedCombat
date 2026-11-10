import { clearEvents, getCombatantAndEventsList, isNormalizationAuthority, normalizeTicks } from "./data.js";
import { TimelineApp } from "./timeline.js";
import { getTimelineApp, setTimelineApp } from "./state.js";
import { refreshTokenHighlight, refreshTokenHighlights } from "./tokenHighlights.js";
import { getEncounterChoices, openTimeline, updateTimelineScale } from "./timelineControls.js";

const MODULE_ID = "tick-combat";
const MODULE_TITLE = "Tick Combat";

async function refreshTimeline({ open = false } = {}) {
  refreshTokenHighlights();
  const app = getTimelineApp();
  if (!app) return;

  const hasItems = getCombatantAndEventsList().length > 0;
  if (!hasItems) {
    if (app.rendered) await app.close();
    return;
  }

  if (open || app.rendered) {
    await app.render({ force: open || !app.rendered });
    app.fitToTimeline?.();
  }
}

function replaceCombatTracker(_app, element) {
  if (!(element instanceof HTMLElement)) return;
  const container = _app.isPopout
    ? element.querySelector(".window-content") ?? element : element;
  container.classList.add("tick-combat-replacement");
  container.querySelector(":scope > .tick-combat-sidebar")?.remove();
  const panel = document.createElement("section");
  panel.className = "tick-combat-sidebar";

  const explanation = document.createElement("p");
  explanation.textContent = "Kämpfe werden über die Tick-Leiste gesteuert.";
  panel.append(explanation);

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.tickCombatLauncher = "true";
  button.classList.add("tick-combat-launcher");
  button.innerHTML = '<i class="fa-solid fa-stopwatch"></i><span>Tick-Leiste öffnen</span>';
  button.title = "Tick-Leiste öffnen und in den Vordergrund holen";
  button.addEventListener("click", async () => {
    const timeline = getTimelineApp();
    if (!timeline) return;
    await openTimeline(timeline);
  });

  panel.append(button);

  if (game.user?.isGM) {
    const encounterLabel = document.createElement("label");
    encounterLabel.className = "tick-combat-encounter-select";
    const caption = document.createElement("span");
    caption.textContent = "Begegnung auswählen";
    const encounters = document.createElement("select");
    encounters.ariaLabel = "Begegnung auswählen";
    encounters.title = "Wählt den Kampf aus, der in der Tick-Leiste angezeigt wird.";
    const empty = document.createElement("option");
    empty.textContent = "Keine Begegnung ausgewählt";
    empty.value = "";
    empty.disabled = true;
    empty.selected = !game.combat;
    encounters.append(empty);
    for (const combat of getEncounterChoices(game.combats ?? [])) {
      const option = document.createElement("option");
      option.value = combat.id;
      option.textContent = combat.label;
      option.selected = combat.id === game.combat?.id;
      encounters.append(option);
    }
    encounters.addEventListener("change", async () => {
      const combat = game.combats.get(encounters.value);
      if (!combat || !game.user?.isGM) return;
      await combat.activate();
      await refreshTimeline({ open: true });
    });
    encounterLabel.append(caption, encounters);
    // With only one encounter there is nothing to switch.
    if ((game.combats?.size ?? 0) > 1) panel.append(encounterLabel);
    const create = document.createElement("button");
    create.type = "button";
    create.textContent = "Neue Begegnung";
    create.addEventListener("click", async () => {
      if (!game.user?.isGM) return;
      await foundry.documents.Combat.implementation.create({
        scene: globalThis.canvas?.scene?.id ?? null, active: true
      });
      await refreshTimeline({ open: true });
    });
    panel.append(create);
  }
  container.append(panel);
}

Hooks.once("init", () => {
  console.info(`${MODULE_ID} | Initializing Foundry V14 ApplicationV2 build`);

  game.settings.register(MODULE_ID, "scale", {
    name: "Timeline scale",
    hint: "Scale used for the Tick Combat timeline window.",
    scope: "client",
    config: true,
    type: Number,
    default: 1,
    choices: {
      0.5: "50%",
      0.75: "75%",
      1: "100%",
      1.25: "125%",
      1.5: "150%"
    },
    onChange: value => updateTimelineScale(getTimelineApp(), value)
  });

  game.settings.register(MODULE_ID, "visibleTickGroups", {
    name: "Visible combatant tick groups",
    hint: "Show all combatants or only the next three distinct tick positions. Waiting combatants remain visible.",
    scope: "client", config: true, type: Number, default: 0,
    choices: { 0: "All", 3: "Next 3 tick positions" },
    onChange: () => refreshTimeline()
  });
});

Hooks.once("ready", async () => {
  setTimelineApp(new TimelineApp());
  await refreshTimeline({ open: true });
  console.info(`${MODULE_ID} | ${MODULE_TITLE} ready`);
});

Hooks.on("renderCombatTracker", replaceCombatTracker);
Hooks.on("canvasReady", refreshTokenHighlights);
Hooks.on("refreshToken", refreshTokenHighlight);
Hooks.on("updateToken", () => refreshTimeline());

Hooks.on("createCombat", async combat => {
  if (isNormalizationAuthority()) await clearEvents(combat);
  await refreshTimeline({ open: true });
});

Hooks.on("updateCombat", async (combat, changes, options) => {
  if (!options?.tickCombatNormalization
    && (Object.hasOwn(changes, "round") || Object.hasOwn(changes, "active"))) {
    await normalizeTicks(combat);
  }
  await refreshTimeline();
});

Hooks.on("deleteCombat", async () => {
  await refreshTimeline();
});

Hooks.on("createCombatant", async combatant => {
  await normalizeTicks(combatant.parent);
  await refreshTimeline({ open: true });
});

Hooks.on("updateCombatant", async (combatant, changes, options) => {
  const changedTickData = Object.hasOwn(changes ?? {}, "flags.tick-combat.data")
    || foundry.utils.hasProperty(changes, "flags.tick-combat.data");
  const changedParticipation = ["hidden", "defeated"].some(key => Object.hasOwn(changes ?? {}, key));
  if (!options?.tickCombatNormalization && (changedTickData || changedParticipation)) {
    await normalizeTicks(combatant.parent);
  }
  await refreshTimeline();
});

Hooks.on("deleteCombatant", async combatant => {
  await normalizeTicks(combatant.parent);
  await refreshTimeline();
});

Hooks.on("updateActor", async actor => {
  const relevant = game.combat?.combatants?.some?.(combatant => combatant.actor?.id === actor.id) ?? false;
  if (relevant) await refreshTimeline();
});
