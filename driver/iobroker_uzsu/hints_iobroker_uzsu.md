# Widget Zeitschaltuhr UZSU unter ioBroker verwenden

Getestet mit device.uzsuicon, zum Beispiel:

{{ device.uzsuicon('', 'javascript.0.uzsu.wlan5.timer', 'Wlan 5GHz', '', '', 'bool', ['An:true','Aus:false']) }}

Für die Ausführung der eingestellten Zeiten unter ioBroker durch das smartVisu Widget UZSU muss der Inhalt der Datei [uzsu.js](hints_iobroker_uzsu.zip) in ein
JavaScript unter ioBroker kopiert werden.
Das JavaScript uzsu.js erzeugt dann entsprechende Timer mithilfe von schedule. Weitere Beschreibung siehe Datei uzsu.js.

## Installation
1. JavaScript mit den Namen 'uzsu' unter ioBroker neu erstellen
2. uzsu.js aus der ZIP-Datei [hints_iobroker_uzsu.zip](hints_iobroker_uzsu.zip) entpacken
3. Den Inhalt der Datei uzsu.js in das ioBroker-JavaScript kopieren
4. Konstante UZSU in diesem JavaScript entsprechend ändern