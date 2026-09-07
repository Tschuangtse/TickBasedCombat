import { getTimelineApp } from "./state.js";

const MODULE_ID = "tick-combat";

const DEFAULT_COMBATANT_DATA = Object.freeze({
  ticks: 0,
  isWaiting: false,
  notes: "",
  ffwd: 0
});

function clone(value) {
  if (globalThis.structuredClone) return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}


function isNormalizationAuthority() {
  if (!game.user?.isGM) return false;
  const activeGM = game.users?.activeGM;
  return !activeGM || activeGM.id === game.user.id;
}

function asInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getCombatantData(combatant) {
  if (!combatant) return clone(DEFAULT_COMBATANT_DATA);

  const stored = combatant.getFlag(MODULE_ID, "data");
  if (!stored) return clone(DEFAULT_COMBATANT_DATA);

  let parsed = stored;
  if (typeof stored === "string") {
    try {
      parsed = JSON.parse(stored);
    } catch (error) {
      console.warn(`${MODULE_ID} | Could not parse legacy combatant data`, error);
      parsed = {};
    }
  }

  return {
    ...clone(DEFAULT_COMBATANT_DATA),
    ...(parsed ?? {}),
    ticks: asInteger(parsed?.ticks, 0),
    ffwd: asInteger(parsed?.ffwd, 0),
    isWaiting: Boolean(parsed?.isWaiting),
    notes: String(parsed?.notes ?? "")
  };
}

export async function setCombatantData(combatant, data) {
  if (!combatant) return;
  const normalized = {
    ticks: asInteger(data?.ticks, 0),
    isWaiting: Boolean(data?.isWaiting),
    notes: String(data?.notes ?? ""),
    ffwd: asInteger(data?.ffwd, 0)
  };
  await combatant.setFlag(MODULE_ID, "data", JSON.stringify(normalized));
}

export async function setTicks(combatant, value = 0) {
  const data = getCombatantData(combatant);
  data.ticks = asInteger(value, 0);
  if (data.ticks > 0) data.isWaiting = false;
  await setCombatantData(combatant, data);
}

export async function setNote(combatant, value = "") {
  const data = getCombatantData(combatant);
  data.notes = String(value ?? "");
  await setCombatantData(combatant, data);
}

export async function toggleWaiting(combatant) {
  const data = getCombatantData(combatant);
  data.isWaiting = !data.isWaiting;
  await setCombatantData(combatant, data);
}

export function getCombatant(id) {
  const combatants = game.combat?.combatants;
  if (!combatants || !id) return null;
  return combatants.get?.(id) ?? [...combatants].find(c => c.id === id) ?? null;
}

function userCanWait(combatant) {
  if (game.user?.isGM) return true;
  return combatant.players?.some(user => user.id === game.user?.id) ?? false;
}

export function getCombatantInfo(combatant) {
  const data = getCombatantData(combatant);
  return {
    id: combatant.id,
    combatant,
    name: combatant.name ?? combatant.actor?.name ?? "Combatant",
    isEvent: false,
    ticks: data.ticks,
    canWait: userCanWait(combatant) && data.ticks === 0,
    isWaiting: data.isWaiting,
    notes: data.notes,
    ffwd: data.ffwd
  };
}

export function getEvents() {
  const events = game.combat?.getFlag(MODULE_ID, "events");
  return Array.isArray(events) ? clone(events) : [];
}

export async function setEvents(events) {
  if (!game.combat) return;
  await game.combat.setFlag(MODULE_ID, "events", clone(events ?? []));
}

export async function clearEvents(combat = game.combat) {
  if (!game.user?.isGM || !combat) return;
  await combat.unsetFlag(MODULE_ID, "events");
  await combat.unsetFlag(MODULE_ID, "totalTicks");
}

export async function addEvent(event) {
  if (!game.combat) return;
  const events = getEvents();
  const created = {
    ...clone(event),
    id: crypto.randomUUID(),
    isEvent: true,
    name: String(event?.name ?? "New Event"),
    notes: String(event?.notes ?? ""),
    ticks: asInteger(event?.ticks, 0),
    repeating: Boolean(event?.repeating),
    ffwd: Boolean(event?.repeating) ? asInteger(event?.ffwd, 8) : -1,
    isHidden: Boolean(event?.isHidden)
  };
  events.push(created);
  await setEvents(events);
}

export async function removeEvent(event) {
  if (!event?.id) return;
  const events = getEvents().filter(existing => existing.id !== event.id);
  await setEvents(events);
}

export async function updateEvent(event) {
  if (!event?.id) return;
  const events = getEvents();
  const index = events.findIndex(existing => existing.id === event.id);
  if (index < 0) return;

  const updated = {
    ...clone(event),
    isEvent: true,
    name: String(event.name ?? "Event"),
    notes: String(event.notes ?? ""),
    ticks: asInteger(event.ticks, 0),
    repeating: Boolean(event.repeating),
    ffwd: event.repeating ? asInteger(event.ffwd, 8) : -1,
    isHidden: Boolean(event.isHidden)
  };

  events[index] = updated;
  await setEvents(events);
}

export async function toggleHideEvent(event) {
  if (!event) return;
  await updateEvent({ ...event, isHidden: !event.isHidden });
}

export function getEventById(id) {
  if (!id) return null;
  return getEvents().find(event => event.id === id) ?? null;
}

export function getCombatantAndEventsList() {
  const combatants = game.combat?.combatants;
  if (!combatants) return [];

  const result = [];
  for (const combatant of combatants) {
    const tokenHidden = combatant.token?.hidden ?? false;
    if (!combatant.hidden && !tokenHidden && !combatant.isDefeated) {
      result.push(getCombatantInfo(combatant));
    }
  }

  let events = getEvents();
  if (!game.user?.isGM) events = events.filter(event => !event.isHidden);

  return [...result, ...events].sort((a, b) => {
    const tickDifference = asInteger(a.ticks) - asInteger(b.ticks);
    if (tickDifference !== 0) return tickDifference;
    return String(a.name ?? "").localeCompare(String(b.name ?? ""));
  });
}

export async function normalizeTicks() {
  if (!isNormalizationAuthority()) return;

  const timeline = getCombatantAndEventsList();
  const active = timeline.filter(item => !item.isWaiting);
  if (!active.length) return;

  const normalization = asInteger(active[0].ticks, 0);
  if (normalization === 0) {
    getTimelineApp()?.render();
    return;
  }

  for (const item of active) {
    const newTicks = asInteger(item.ticks, 0) - normalization;
    if (item.isEvent) {
      await updateEvent({ ...item, ticks: newTicks });
    } else {
      await setTicks(item.combatant, newTicks);
    }
  }

  if (game.combat?.started && game.user?.isGM) {
    const totalTicks = asInteger(game.combat.getFlag(MODULE_ID, "totalTicks"), 0);
    await game.combat.setFlag(MODULE_ID, "totalTicks", totalTicks + normalization);
  }

  const app = getTimelineApp();
  app?.render();
  app?.fitToTimeline?.();
}
