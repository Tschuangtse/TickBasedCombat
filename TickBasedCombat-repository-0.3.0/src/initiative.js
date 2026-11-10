import { getCombatantData, setCombatantData } from "./data.js";

export function canRollInitiative(combatant) {
  return Boolean(combatant?.parent && !combatant.parent.started
    && (game.user?.isGM || combatant.isOwner));
}

export function validateInitiativeValues(reaction, impairment) {
  return [reaction, impairment].every(value => Number.isSafeInteger(value) && value >= 0);
}

export async function rollInitiative(combatant) {
  if (!canRollInitiative(combatant)) return;
  const combat = combatant.parent;
  const content = document.createElement("div");
  content.innerHTML = `
    <div class="tick-combat-dialog">
    <div class="tick-combat-fields">
      <label class="tick-combat-field"><span>Reaktionsvermögen</span>
        <input class="tick-combat-initiative-input" name="reaction" type="number" min="0" step="1" value="0" required autofocus>
      </label>
      <label class="tick-combat-field"><span>Beeinträchtigung</span>
        <input class="tick-combat-initiative-input" name="impairment" type="number" min="0" step="1" value="0" required>
      </label>
      <p>Initiale Ticks = 30 − Reaktionsvermögen + Beeinträchtigung − 1W6</p>
    </div>
    </div>`;
  const result = await foundry.applications.api.DialogV2.input({
    window: { title: `Initiative: ${combatant.name}` },
    content, modal: true, rejectClose: false,
    ok: { label: "Initiative würfeln", icon: "fa-solid fa-dice-d6" }
  });
  if (!result) return;
  const reaction = Number(result.reaction);
  const impairment = Number(result.impairment);
  if (!validateInitiativeValues(reaction, impairment)) {
    ui.notifications?.warn("Bitte für beide Werte ganze Zahlen ab 0 eingeben.");
    return;
  }
  if (!canRollInitiative(combatant) || combat !== game.combat) return;
  const roll = await new foundry.dice.Roll(
    "30 - @reaction + @impairment - 1d6", { reaction, impairment }
  ).evaluate();
  // A GM may have started the encounter while the dialog or roll was open.
  if (!canRollInitiative(combatant) || combat !== game.combat) return;
  await setCombatantData(combatant, {
    ...getCombatantData(combatant), ticks: roll.total, isWaiting: false
  });
}
