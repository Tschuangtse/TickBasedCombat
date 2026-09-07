# Installation und Test — Tick Combat V14

Diese Anleitung ist absichtlich detailliert. Die Version 0.3.0 ist ein **Test-Build für Foundry VTT Version 14** und wurde außerhalb einer laufenden Foundry-Instanz statisch geprüft. Teste sie zuerst in einer Kopie deiner Welt.

## 1. Foundry vollständig beenden

Beende den Foundry-Server, bevor du Dateien im Modulverzeichnis austauschst. Es genügt nicht, nur den Browser-Tab zu schließen.

## 2. User-Data-Verzeichnis bestimmen

Gesucht ist das Foundry-**User Data**-Verzeichnis, in dem der Unterordner `Data` liegt. Darunter befindet sich:

`Data/modules/`

Der vorhandene Modulordner sollte deshalb ungefähr so aussehen:

`Data/modules/tick-combat/`

Darin muss direkt die Datei `module.json` liegen.

## 3. Sicherungen anlegen

Lege vor dem Austausch mindestens zwei Sicherungen an:

1. Eine Kopie des bisherigen Ordners `Data/modules/tick-combat/`.
2. Eine Sicherung beziehungsweise Kopie der Welt, mit der du Tick Combat verwendest.

Die Weltkopie ist für den Funktionstest gedacht. Aktiviere den neuen Build nicht zuerst in deiner produktiven Kampagnenwelt.

## 4. Alten Modulordner entfernen oder umbenennen

Benenne den bisherigen Ordner beispielsweise in

`tick-combat-v11-backup`

um **oder** verschiebe ihn vollständig aus `Data/modules/` heraus.

Wichtig: In `Data/modules/` darf nicht gleichzeitig ein zweiter aktiver Modulordner mit derselben Modul-ID `tick-combat` liegen.

## 5. Neues ZIP entpacken

Das bereitgestellte ZIP enthält bereits den Ordner `tick-combat`.

Entpacke das ZIP direkt nach:

`Data/modules/`

Danach muss diese Datei existieren:

`Data/modules/tick-combat/module.json`

Falsch wäre zum Beispiel:

`Data/modules/tick-combat/tick-combat/module.json`

Wenn diese doppelte Verschachtelung entstanden ist, verschiebe den inneren `tick-combat`-Ordner eine Ebene nach oben.

## 6. Foundry starten und Modul-Erkennung prüfen

Starte Foundry VTT 14.367.

Gehe auf der Setup-Oberfläche zu den installierten Add-on Modules. Dort sollte nun erscheinen:

**Tick Combat (Foundry V14)** — Version **0.3.0**

Wenn das Modul hier nicht auftaucht, aktiviere noch keine Welt. Prüfe zuerst die Ordnerstruktur aus Schritt 5.

## 7. Testwelt verwenden

Öffne eine Kopie deiner normalen Welt oder eine separate Testwelt, die dasselbe Spielsystem verwendet.

Öffne in dieser Welt **Manage Modules / Module verwalten**, aktiviere **Tick Combat (Foundry V14)** und speichere die Modulkonfiguration.

Nach dem Reload sollte in der Browser-Konsole eine Meldung ähnlich dieser erscheinen:

`tick-combat | Initializing Foundry V14 ApplicationV2 build`

und anschließend:

`tick-combat | Tick Combat ready`

## 8. Browser-Konsole öffnen

Öffne die Entwicklerwerkzeuge deines Browsers. In Chrome, Edge und Firefox funktioniert normalerweise `F12`.

Wechsle dort auf **Console / Konsole**.

Rote Fehlermeldungen sind für den Test besonders wichtig. Wenn eine Fehlermeldung `tick-combat`, `timeline.js`, `main.js`, `data.js` oder `editEvent.js` erwähnt, kopiere die komplette Meldung inklusive Stack Trace.

## 9. Funktionstest

| Nr. | Test | Erwartetes Ergebnis |
|---:|---|---|
| 1 | Encounter anlegen und zwei Token als Combatants hinzufügen | Keine rote Fehlermeldung; Combatants erscheinen im Encounter |
| 2 | Combat Tracker öffnen | Ein **Timeline**-Button erscheint |
| 3 | Timeline öffnen | Eigenes ApplicationV2-Fenster öffnet sich |
| 4 | Combat starten | Timeline zeigt den gestarteten Zustand und `Total` an |
| 5 | Bei einem Combatant `+5` eingeben und Enter drücken | Tickwerte werden normalisiert; der niedrigste aktive Wert wird 0 |
| 6 | Einen Combatant bei Tick 0 auf **Wait** setzen | Combatant wird als wartend markiert; die übrige Timeline kann weiterlaufen |
| 7 | Als GM ein Event hinzufügen | Event erscheint an seiner Tickposition |
| 8 | Wiederholendes Event weiterdrehen | Event wird um sein Repeat-Intervall verschoben |
| 9 | Event verstecken | GM sieht den versteckten Zustand; Spieler sollen das Event nicht sehen |
| 10 | Shift-Klick auf einen Combatant-Namen | Token wird auf dem Canvas gepingt |
| 11 | Combatant-Namen anklicken | Bearbeitungsdialog öffnet sich über DialogV2 |
| 12 | Combat beenden und neuen Encounter anlegen | Neuer Combat beginnt ohne alte Eventliste/Total-Tick-Zähler |

## 10. Wenn ein Fehler auftritt

Notiere beziehungsweise kopiere:

- die Aktion unmittelbar vor dem Fehler;
- die komplette erste rote Fehlermeldung;
- alle Stack-Trace-Zeilen mit `tick-combat`;
- Name und Version des verwendeten Spielsystems;
- ob der Fehler als GM oder Spieler auftrat;
- ob der Fehler nur bei einer bestehenden Welt oder auch in einer frischen Testwelt auftritt.

Mit diesen Angaben kann der konkrete V14-Laufzeitfehler normalerweise gezielt behoben werden.

## 11. Rückbau

Wenn der Test scheitert:

1. Foundry wieder vollständig beenden.
2. Den neuen `Data/modules/tick-combat/`-Ordner entfernen.
3. Den gesicherten alten Modulordner wieder unter dem Namen `tick-combat` herstellen.
4. Für die produktive Welt im Zweifel ebenfalls die vor dem Test angelegte Welt-Sicherung verwenden.

Der V14-Build behält für Combatant-Daten bewusst das alte JSON-String-Flagformat bei, um keine unnötige Datenmigration zu erzwingen. Eine vollständige Welt-Sicherung bleibt trotzdem die sichere Rückfalloption.
