# Tick Based Combat 0.3.7

Dieses Release verbessert die Darstellung und Dauer-Eingabe komplexer Handlungen.

## Änderungen

- **Zentrierter Handlungstitel:** Der Name der komplexen Handlung steht auf der Kämpferkarte zentriert, passend zu Fortschritt und Intervall-Button.
- **Sichtbare Auf-/Ab-Steuerung:** Das Dauerfeld besitzt eigene Pfeil-Buttons, die auch dann sichtbar bleiben, wenn Foundry die nativen Pfeile des Zahlenfelds ausblendet.
- Die Dauer startet bei **8 Ticks**, erhöht oder verringert sich pro Klick um **8 Ticks** und kann nicht unter 8 geklickt werden. Direkte Zahleneingabe bleibt möglich; gültig sind Vielfache von 8.

## Update

Das Modul kann über Foundrys Modulverwaltung aktualisiert werden. Die Manifest-Adresse bleibt unverändert:

`https://github.com/Tschuangtse/TickBasedCombat/releases/latest/download/module.json`

Enthaltene Dateien: **module.json** und **tick-combat-v14-0.3.7.zip**. Bestehende Kampfdaten bleiben erhalten.

## Prüfung

- 31 automatisierte Tests sowie JavaScript-Syntax- und ZIP-Inhaltsprüfung bestanden.
- Im isolierten Browser wurden die sichtbaren Auf-/Ab-Buttons, die Schrittfolge 8 → 16 → 24 und zurück, Mindestwert 8, direkte Eingabe und die Zentrierung geprüft.
- 36 Fenstergrößen-/Zoom-Kombinationen mit dem tatsächlichen Handlebars-Template geprüft.
- Foundry V14; unveränderte Kompatibilitätsangabe im Manifest: 14.367. Der Funktionstest dieser UI-Anpassungen in einer laufenden Foundry-Welt steht noch aus.
