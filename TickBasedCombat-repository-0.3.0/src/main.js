import { clearEvents, getCombatantAndEventsList, normalizeTicks, setTicks } from "./data.js";
import { TimelineApp } from "./timeline.js";
import { getTimelineApp, setTimelineApp } from "./state.js";

const MODULE_ID = "tick-combat";
const MODULE_TITLE = "Tick Combat";

async function refreshTimeline({ open = false } = {}) {
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

function injectCombatTrackerButton(_app, element) {
  if (!(element instanceof HTMLElement)) return;
  if (element.querySelector("[data-tick-combat-launcher]")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.tickCombatLauncher = "true";
  button.classList.add("tick-combat-launcher");
  button.innerHTML = '<i class="fa-solid fa-stopwatch"></i><span>Timeline</span>';
  button.title = "Open Tick Combat timeline";
  button.addEventListener("click", async () => {
    const timeline = getTimelineApp();
    if (!timeline) return;
    await timeline.render({ force: true });
    timeline.fitToTimeline?.();
  });

  const header = element.querySelector("header") ?? element;
  header.append(button);
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
      0.75: "75%",
      1: "100%",
      1.25: "125%",
      1.5: "150%"
    },
    onChange: value => {
      const app = getTimelineApp();
      if (app?.rendered) app.setPosition({ scale: Number(value) || 1 });
    }
  });
});

Hooks.once("ready", async () => {
  setTimelineApp(new TimelineApp());
  await refreshTimeline({ open: true });
  console.info(`${MODULE_ID} | ${MODULE_TITLE} ready`);
});

Hooks.on("renderCombatTracker", injectCombatTrackerButton);

Hooks.on("createCombat", async combat => {
  if (game.user?.isGM) await clearEvents(combat);
  await refreshTimeline({ open: true });
});

Hooks.on("updateCombat", async () => {
  await refreshTimeline();
});

Hooks.on("deleteCombat", async () => {
  const app = getTimelineApp();
  if (app?.rendered) await app.close();
});

Hooks.on("createCombatant", async combatant => {
  if (game.user?.isGM) await setTicks(combatant, 0);
  await normalizeTicks();
  await refreshTimeline({ open: true });
});

Hooks.on("updateCombatant", async (_combatant, changes, _options, userId) => {
  const changedTickData = Object.hasOwn(changes ?? {}, "flags.tick-combat.data")
    || foundry.utils.hasProperty(changes, "flags.tick-combat.data");
  if (userId !== game.user.id && changedTickData) {
    await normalizeTicks();
  }
  await refreshTimeline();
});

Hooks.on("deleteCombatant", async () => {
  await normalizeTicks();
  await refreshTimeline();
});

Hooks.on("updateActor", async actor => {
  const relevant = game.combat?.combatants?.some?.(combatant => combatant.actor?.id === actor.id) ?? false;
  if (relevant) await refreshTimeline();
});
