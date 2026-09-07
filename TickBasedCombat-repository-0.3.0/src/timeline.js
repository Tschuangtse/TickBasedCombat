import {
  addEvent,
  getCombatant,
  getCombatantAndEventsList,
  getCombatantInfo,
  getEventById,
  normalizeTicks,
  removeEvent,
  setNote,
  setTicks,
  toggleHideEvent,
  toggleWaiting,
  updateEvent
} from "./data.js";
import { editEvent } from "./editEvent.js";

const MODULE_ID = "tick-combat";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

function parseInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function groupedTimeline() {
  const groups = new Map();
  for (const item of getCombatantAndEventsList()) {
    const ticks = parseInteger(item.ticks, 0);
    if (!groups.has(ticks)) groups.set(ticks, { ticks, items: [] });
    groups.get(ticks).items.push(item);
  }
  return [...groups.values()];
}

export class TimelineApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "timeline-app",
    classes: ["tick-combat-app"],
    position: {
      width: 500,
      height: "auto",
      scale: 1
    },
    window: {
      title: "Timeline",
      icon: "fa-solid fa-stopwatch",
      resizable: false,
      minimizable: true
    },
    actions: {
      addEvent: this._onAddEvent,
      cycleScale: this._onCycleScale,
      startCombat: this._onStartCombat,
      endCombat: this._onEndCombat,
      editItem: this._onEditItem,
      fastForward: this._onFastForward,
      deleteEvent: this._onDeleteEvent,
      toggleWait: this._onToggleWait,
      toggleHide: this._onToggleHide
    }
  };

  static PARTS = {
    main: {
      template: "modules/tick-combat/templates/timeline.hbs"
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const list = groupedTimeline();
    const scale = Number(game.settings.get(MODULE_ID, "scale") ?? 1);

    return {
      ...context,
      list,
      isGM: Boolean(game.user?.isGM),
      scale,
      totalTicks: parseInteger(game.combat?.getFlag(MODULE_ID, "totalTicks"), 0),
      started: Boolean(game.combat?.started),
      hasCombat: Boolean(game.combat)
    };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);

    for (const input of this.element.querySelectorAll("input.tick-combat-ticks")) {
      input.addEventListener("focus", event => event.currentTarget.select());
      input.addEventListener("keydown", event => this._onTickKeydown(event));
    }

    this.fitToTimeline();
  }

  fitToTimeline() {
    const groups = groupedTimeline().length;
    const desired = 90 + (groups * 134);
    const viewportLimit = Math.max(360, (globalThis.innerWidth ?? 1280) - 120);
    const width = Math.min(Math.max(desired, 360), viewportLimit);
    const scale = Number(game.settings.get(MODULE_ID, "scale") ?? 1);
    return super.setPosition({ width, height: "auto", scale });
  }

  async _onTickKeydown(event) {
    if (event.key !== "Enter" || !game.user?.isGM) return;
    event.preventDefault();

    const delta = parseInteger(event.currentTarget.value, 0);
    if (delta === 0) return;

    const combatant = getCombatant(event.currentTarget.dataset.id);
    if (!combatant) return;

    const current = getCombatantInfo(combatant).ticks;
    await setTicks(combatant, current + delta);
    event.currentTarget.value = "0";
    await normalizeTicks();
  }

  static async _onAddEvent() {
    if (!game.user?.isGM) return;
    if (!game.combat) {
      ui.notifications?.warn("Create a combat encounter before adding a timeline event.");
      return;
    }

    const eventData = {
      name: "New Event",
      isEvent: true,
      ticks: 100,
      ffwd: 1,
      repeating: true,
      notes: ""
    };

    await editEvent(eventData, async data => {
      await addEvent(data);
      await normalizeTicks();
    });

    this.render();
  }

  static async _onCycleScale() {
    const current = Number(game.settings.get(MODULE_ID, "scale") ?? 1);
    const values = [0.75, 1, 1.25, 1.5];
    const currentIndex = values.findIndex(value => Math.abs(value - current) < 0.01);
    const next = values[(currentIndex + 1 + values.length) % values.length];
    await game.settings.set(MODULE_ID, "scale", next);
    this.fitToTimeline();
  }

  static async _onStartCombat() {
    if (!game.user?.isGM || !game.combat) return;
    await game.combat.setFlag(MODULE_ID, "totalTicks", 0);
    if (!game.combat.started) await game.combat.startCombat();
    this.render();
  }

  static async _onEndCombat() {
    if (!game.user?.isGM || !game.combat?.started) return;
    await game.combat.endCombat();
    this.render();
  }

  static async _onEditItem(event, target) {
    const id = target.dataset.id;
    if (!id) return;

    const combatant = getCombatant(id);

    if (event.shiftKey && combatant?.token) {
      const token = combatant.token;
      const activeCanvas = globalThis.canvas;
      const center = token.object?.center ?? {
        x: token.x + ((token.width ?? 1) * (activeCanvas?.grid?.size ?? 100) / 2),
        y: token.y + ((token.height ?? 1) * (activeCanvas?.grid?.size ?? 100) / 2)
      };
      if (activeCanvas?.ready) await activeCanvas.ping(center, { duration: 3000 });
      return;
    }

    if (!game.user?.isGM) return;

    if (combatant) {
      const current = getCombatantInfo(combatant);
      await editEvent(current, async data => {
        await setTicks(combatant, data.ticks);
        await setNote(combatant, data.notes);
        await combatant.update({ name: data.name });
        if (combatant.token) await combatant.token.update({ name: data.name });
        await normalizeTicks();
      });
      this.render();
      return;
    }

    const timelineEvent = getEventById(id);
    if (!timelineEvent) return;

    await editEvent(timelineEvent, async data => {
      await updateEvent(data);
      await normalizeTicks();
    });
    this.render();
  }

  static async _onFastForward(_event, target) {
    if (!game.user?.isGM) return;
    const timelineEvent = getEventById(target.dataset.id);
    if (!timelineEvent) return;

    if (parseInteger(timelineEvent.ffwd, -1) > 0) {
      await updateEvent({
        ...timelineEvent,
        ticks: parseInteger(timelineEvent.ticks, 0) + parseInteger(timelineEvent.ffwd, 0)
      });
    } else {
      await removeEvent(timelineEvent);
    }

    await normalizeTicks();
    this.render();
  }

  static async _onDeleteEvent(_event, target) {
    if (!game.user?.isGM) return;
    const timelineEvent = getEventById(target.dataset.id);
    if (!timelineEvent) return;
    await removeEvent(timelineEvent);
    await normalizeTicks();
    this.render();
  }

  static async _onToggleWait(_event, target) {
    const combatant = getCombatant(target.dataset.id);
    if (!combatant) return;

    const info = getCombatantInfo(combatant);
    if (!info.canWait) return;

    await toggleWaiting(combatant);
    if (game.user?.isGM) await normalizeTicks();
    this.render();
  }

  static async _onToggleHide(_event, target) {
    if (!game.user?.isGM) return;
    const timelineEvent = getEventById(target.dataset.id);
    if (!timelineEvent) return;
    await toggleHideEvent(timelineEvent);
    this.render();
  }
}
