# Tick Based Combat 0.3.4

Dieses Fehlerbehebungs-Release korrigiert die Fensteraktualisierung und ersetzt das Initiative-Rechtsklickmenü durch einen Würfel-Button.

## Korrekturen und Bedienung

- **Fensteraktualisierung repariert:** Das bisherige Rechtsklickmenü wurde entfernt. Sein fehlerhaftes Schließen konnte das Neuzeichnen abbrechen. Dadurch blieb die Anzeige unter anderem nach dem Kampfstart stehen, obwohl der Kampf bereits gestartet war.
- **Tick-Leiste öffnen:** Der Button öffnet die Leiste, stellt sie aus dem minimierten Zustand wieder her und holt sie in den Vordergrund.
- **Initiative per Würfel-Icon:** Vor Kampfbeginn erscheint neben dem Namen ein Würfel-Button für die Spielleitung und berechtigte Besitzer. Bis zum Kampfstart ist Neuwürfeln möglich; danach verschwindet der Button.
- **Initiative-Dialog repariert:** Der Dialog erfüllt die V14-Vorgabe eines äußeren Inhaltselements ohne Attribute. Reaktionsvermögen und Beeinträchtigung lassen sich mit Auf-/Ab-Pfeilen oder direkt per Tastatur eingeben. Erlaubt sind ganze Zahlen ab 0. Die Formel bleibt **30 − Reaktionsvermögen + Beeinträchtigung − 1W6**.
- **Zoom-Anzeige:** Die Zahl neben der Lupe wird beim Skalieren aktualisiert.
- **Keine überlappenden Karten:** Tick-Spalten behalten ihre Breite und Karten die benötigte Inhaltshöhe. Bei Platzmangel wird gescrollt. Lange Namen werden gekürzt und sind als Tooltip vollständig lesbar.
- **Verständliche Begegnungsauswahl:** Die Auswahl erscheint nur bei mehreren Kämpfen, ist beschriftet und zeigt lesbare Bezeichnungen statt interner Dokument-IDs.

## Update

Das Modul kann in Foundry über die bestehende Update-Funktion aktualisiert werden. Manifest-Adresse:

`https://github.com/Tschuangtse/TickBasedCombat/releases/latest/download/module.json`

Enthaltene Dateien: **module.json** und **tick-combat-v14-0.3.4.zip**. Modul-ID und vorhandene Kampfdaten bleiben erhalten.

## Prüfung

- 19 automatisierte Tests sowie JavaScript-Syntax- und Paketstrukturprüfung bestanden.
- 36 isolierte Chromium-Layoutprüfungen über verschiedene Fenstergrößen und Zoomstufen bestanden.
- Der Initiative-Dialog wurde im isolierten Browser auf direkte Eingabe, Auf-/Ab-Steuerung, Mindestwert 0, ungültige Eingaben, Neuwürfeln und Sperre nach Kampfbeginn geprüft.
- Foundry V14; unveränderte Kompatibilitätsangabe im Manifest: 14.367. Die Prüfung in einer laufenden Foundry-Welt steht noch aus.
