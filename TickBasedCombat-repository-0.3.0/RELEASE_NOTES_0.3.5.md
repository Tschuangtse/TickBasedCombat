# Tick Based Combat 0.3.5

Dieses Release behebt das Speichern des Gesamt-Tick-Zählers und vereinheitlicht die Moduloberfläche auf Englisch.

## Korrekturen

- **Verstrichene Ticks werden gespeichert:** Beim Aktualisieren eingebetteter Kämpfer ergänzt Foundry die Update-Optionen um deren übergeordneten Kampf. Die anschließende Aktualisierung des Kampfes verwendet jetzt eigene Optionen. Dadurch entfällt der Fehler „Combat is not a valid embedded Document within the Combat Document“, der das Speichern von Ereignissen und Gesamt-Ticks nach der Tick-Verschiebung verhinderte.
- **Keine Mehrfachzählung:** Gemeinsame Zeitschritte zählen weiterhin einmal. Ein Regressionstest prüft mehrere aufeinanderfolgende Zeitschritte und wiederholte Normalisierungsaufrufe mit dem Optionsverhalten von Foundry.
- **Englische UI-Texte:** Tracker-Buttons, Begegnungsauswahl und Statusangaben sowie Initiative-Felder, Tooltips und Validierungsmeldungen sind jetzt standardmäßig Englisch. Eigene Namen und Notizen bleiben unverändert.

## Update

In Foundrys Modulverwaltung nach Updates suchen und **Tick Based Combat** aktualisieren. Die Manifest-Adresse bleibt unverändert:

`https://github.com/Tschuangtse/TickBasedCombat/releases/latest/download/module.json`

Enthaltene Dateien: **module.json** und **tick-combat-v14-0.3.5.zip**. Modul-ID und vorhandene Kampfdaten bleiben erhalten.

## Prüfung

- 20 automatisierte Tests, darunter der Regressionstest für die gemeldete Update-Fehlermeldung, bestanden.
- JavaScript-Syntax und Inhalt des installierbaren ZIP-Pakets geprüft.
- Foundry V14; unveränderte Kompatibilitätsangabe im Manifest: 14.367. Der Funktionstest dieser Korrektur in einer laufenden Foundry-Welt steht noch aus.
