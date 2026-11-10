import { getCombatantData, normalizeTicks, setCombatantData } from "./data.js";
import { COMPLEX_ACTION_INTERVAL, isComplexActionDuration } from "./complexActionData.js";

const pendingUpdates = new WeakSet();
const pendingDialogs = new WeakSet();

export function canManageComplexAction(combatant) {
  return Boolean(combatant && combatant.parent === game.combat && !combatant.hidden
    && !combatant.token?.hidden && !combatant.isDefeated
    && (game.user?.isGM || combatant.isOwner));
}

export function getSelectedCombatant() {
  const controlled = globalThis.canvas?.tokens?.controlled ?? [];
  if (controlled.length !== 1) return null;
  const token = controlled[0];
  return game.combat?.combatants?.find(combatant => combatant.tokenId === token.id
    && combatant.sceneId === token.document?.parent?.id) ?? null;
}

export async function beginComplexAction(combatant, { name, duration }) {
  name = String(name ?? "").trim();
  if (!canManageComplexAction(combatant) || !name || !isComplexActionDuration(duration)
    || pendingUpdates.has(combatant)) return false;
  const data = getCombatantData(combatant);
  if (data.complexAction) return false;
  pendingUpdates.add(combatant);
  try {
    await setCombatantData(combatant, {
      ...data,
      ticks: data.ticks + COMPLEX_ACTION_INTERVAL,
      isWaiting: false,
      complexAction: duration > COMPLEX_ACTION_INTERVAL
        ? { name, duration, spent: COMPLEX_ACTION_INTERVAL } : null
    });
    await normalizeTicks(combatant.parent);
    return true;
  } finally { pendingUpdates.delete(combatant); }
}

export function canAdvanceComplexAction(combatant) {
  if (!canManageComplexAction(combatant)) return false;
  const data = getCombatantData(combatant);
  return Boolean(data.complexAction && data.ticks === 0);
}

export async function advanceComplexAction(combatant) {
  if (!canAdvanceComplexAction(combatant) || pendingUpdates.has(combatant)) return false;
  pendingUpdates.add(combatant);
  try {
    const data = getCombatantData(combatant);
    const action = data.complexAction;
    const spent = action.spent + COMPLEX_ACTION_INTERVAL;
    await setCombatantData(combatant, {
      ...data,
      ticks: COMPLEX_ACTION_INTERVAL,
      complexAction: spent < action.duration ? { ...action, spent } : null
    });
    await normalizeTicks(combatant.parent);
    return true;
  } finally { pendingUpdates.delete(combatant); }
}

export async function promptComplexAction() {
  const combatant = getSelectedCombatant();
  if (!canManageComplexAction(combatant)) {
    ui.notifications?.warn("Select exactly one active combat token that you own.");
    return false;
  }
  if (getCombatantData(combatant).complexAction) {
    ui.notifications?.warn("This combatant is already performing a complex action.");
    return false;
  }
  if (pendingDialogs.has(combatant)) return false;
  pendingDialogs.add(combatant);
  try {
    // DialogV2 requires an attribute-free outer div.
    const content = document.createElement("div");
    content.innerHTML = `<div class="tick-combat-dialog"><div class="tick-combat-fields">
      <label class="tick-combat-field"><span>Action</span>
        <input name="name" type="text" required autofocus autocomplete="off">
      </label>
      <label class="tick-combat-field"><span>Total duration (ticks)</span>
        <input class="tick-combat-initiative-input" name="duration" type="number" min="8" step="8" value="8" required>
      </label>
    </div></div>`;
    const result = await foundry.applications.api.DialogV2.input({
      window: { title: "Complex action" },
      content, modal: true, rejectClose: false,
      ok: { label: "Begin action", icon: "fa-solid fa-hourglass-start" }
    });
    if (!result) return false;
    const name = String(result.name ?? "").trim();
    const duration = Number(result.duration);
    if (!name || !isComplexActionDuration(duration)) {
      ui.notifications?.warn("Enter an action and a duration of at least 8 ticks in steps of 8.");
      return false;
    }
    if (getSelectedCombatant() !== combatant) return false;
    return await beginComplexAction(combatant, { name, duration });
  } finally { pendingDialogs.delete(combatant); }
}
