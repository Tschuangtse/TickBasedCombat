# Tick Based Combat 0.3.12

Beim Laden setzt der aktive Spielleiter einen bereits gestarteten Kampf fort, wenn die Tick-Leiste noch nicht normalisiert ist. Der kleinste aktive Tick-Wert wird auf null gesetzt und die verstrichene Zeit wird entsprechend nachgetragen. Der Fix für den Foundry-Dokumenttyp Combatant aus 0.3.11 ist enthalten.

Der Regressionstest lädt einen gestarteten Kampf mit deutscher Oberfläche und den Werten 4, 13 und 20. Die Zeitleiste rückt auf 0, 9 und 16 vor und zeigt 4 verstrichene Ticks. Eine erneute Normalisierung zählt die 4 Ticks nicht noch einmal.
