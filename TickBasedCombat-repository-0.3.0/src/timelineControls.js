export async function openTimeline(app) {
  if (!app) return;
  await app.render({ force: true });
  if (app.minimized) await app.maximize();
  app.fitToTimeline?.();
  app.bringToFront();
}

export async function updateTimelineScale(app, value) {
  if (!app?.rendered) return;
  app.setPosition({ scale: Number(value) || 1 });
  await app.render({ parts: ["main"] });
}

export function getEncounterChoices(combats) {
  return [...combats].map((combat, index) => {
    const label = combat.name?.trim() || combat.scene?.name?.trim() || `Begegnung ${index + 1}`;
    const state = combat.started ? "läuft" : "nicht gestartet";
    return { id: combat.id, label: `${label} (${state})` };
  });
}
