# Tick Based Combat 0.3.6

Dieses Release ergänzt komplexe Handlungen, die ein Kämpfer in mehreren Intervallen von jeweils 8 Ticks ausführt.

## Komplexe Handlungen

1. Genau einen aktiven Kampf-Token auswählen. Berechtigt sind dessen Besitzer und die Spielleitung.
2. In der Tick-Leiste **Complex action** anklicken.
3. Im Dialog den Handlungsnamen als Freitext und die Gesamtdauer festlegen. Die Dauer beträgt mindestens 8 Ticks und ist in 8er-Schritten per Zahlenfeld oder direkter Eingabe wählbar.
4. Beim Start wird der Kämpfer um 8 Ticks nach hinten verschoben. Seine Karte zeigt den Handlungsnamen und den Fortschritt, beispielsweise **8/32 ticks**, statt der normalen Tick-Eingabe.
5. Sobald er wieder Tick 0 erreicht, kann mit **Next 8 ticks** das nächste Intervall verbucht werden. Außerhalb von Tick 0 ist der Button deaktiviert.
6. Beim Verbuchen des letzten Intervalls wird die Karte sofort wieder normal; die letzten 8 Ticks stehen dann noch an. Eine Handlung mit genau 8 Ticks kehrt daher unmittelbar nach dem Start zur normalen Karte zurück.

Name und Fortschritt werden mit dem Kämpfer gespeichert und über Foundry synchronisiert. Während einer komplexen Handlung sind die normale Tick-Eingabe und die Wartefunktion auf der Karte ersetzt. Ereignisse, Gesamt-Tick-Zähler und Drei-Tickpositions-Filter arbeiten weiterhin mit der vollständigen Zeitleiste.

## Update

In Foundrys Modulverwaltung nach Updates suchen und **Tick Based Combat** aktualisieren. Die Manifest-Adresse bleibt unverändert:

`https://github.com/Tschuangtse/TickBasedCombat/releases/latest/download/module.json`

Enthaltene Dateien: **module.json** und **tick-combat-v14-0.3.6.zip**. Modul-ID und bestehende Kampfdaten bleiben erhalten.

## Prüfung

- 31 automatisierte Tests, einschließlich vollständigem 32-Tick-Ablauf, Berechtigungen, Auswahl, Neuladen, ungültigen Eingaben und parallelen Klicks, bestanden.
- Das tatsächliche Handlebars-Template wurde im isolierten Browser mit dem Zwei-Feld-Dialog, der 8er-Schrittsteuerung und dem Übergang zurück zur normalen Karte geprüft.
- 36 Browserprüfungen für unterschiedliche Fenstergrößen und Zoomstufen sowie JavaScript-Syntax- und ZIP-Inhaltsprüfung bestanden.
- Foundry V14; unveränderte Kompatibilitätsangabe im Manifest: 14.367. Der Funktionstest dieses Features in einer laufenden Foundry-Welt steht noch aus.
