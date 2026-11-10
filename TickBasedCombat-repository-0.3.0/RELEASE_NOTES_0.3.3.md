# Tick Based Combat 0.3.3

Diese Version erweitert die Tick-Leiste für übersichtlichere Kämpfe und ergänzt eine eigene Initiative-Ermittlung.

## Änderungen

- **Combat Tracker:** Die normale Teilnehmerliste und Runden-/Zugsteuerung werden durch den Zugang zur Tick-Leiste ersetzt. Begegnungen können weiterhin angelegt und ausgewählt werden.
- **Token bei Tick 0:** Alle sichtbaren, nicht besiegten Kämpfer bei Tick 0 erhalten eine goldfarbene Umrandung auf der Battlemap. Auswahl, Ziele und Berechtigungen bleiben unverändert.
- **Initiative per Rechtsklick:** Vor Kampfbeginn können Spielleitung und Besitzer eines Kämpfers dessen Initiative auswürfeln. Reaktionsvermögen und Beeinträchtigung sind ganze Zahlen ab 0. Die Formel lautet: **30 − Reaktionsvermögen + Beeinträchtigung − 1W6**. Die Ergebnisse bleiben bis zum Kampfbeginn als initiale Tick-Werte stehen.
- **Verstrichene Ticks:** Der Zähler erfasst gemeinsame Zeitschritte nur einmal, auch bei mehreren gleichzeitig fälligen Kämpfern. Wartende Kämpfer blockieren den Zeitfortschritt nicht.
- **Fenstergröße:** Zusätzliche Skalierung auf 50 % und frei ziehbare Fenstergröße mit mindestens 360 × 220 Layout-Pixeln. Aktualisierungen erhalten die gewählte Größe; längere Inhalte sind scrollbar.
- **Nächste drei Tickpositionen:** Über „All / Next 3“ oder die clientseitige Einstellung kann die Anzeige auf die nächsten drei unterschiedlichen aktiven Kämpfer-Tickpositionen begrenzt werden. Gleichstände werden vollständig angezeigt. Wartende Kämpfer bleiben erreichbar; Ereignisse bis zur letzten sichtbaren Position bleiben sichtbar. Die Zeitberechnung wird durch den Filter nicht verändert.

## Installation und Update

Das Release enthält die Dateien **module.json** und **tick-combat-v14-0.3.3.zip**. Die bestehende Manifest-Adresse bleibt erhalten:

`https://github.com/Tschuangtse/TickBasedCombat/releases/latest/download/module.json`

Bereits installierte Module können über Foundrys Modul-Update-Funktion aktualisiert werden. Im ZIP liegt das Modul im Ordner `tick-combat`; die Modul-ID und vorhandene Flag-Daten bleiben erhalten.

## Kompatibilität und Prüfung

- Foundry Virtual Tabletop V14; Kompatibilitätsangabe im Manifest: 14.367.
- 13 automatisierte Tests sowie JavaScript-Syntax- und Paketstrukturprüfung bestanden.
- Ein Funktionstest dieser Änderungen in einer laufenden Foundry-V14-Welt steht noch aus. Bitte zunächst mit einer Weltkopie testen.
