Hinweise zum neuen openHAB Treiber:

Der Treiber unterstützt alle Widgets, Devices und Plots von smartVISU und alle Items aus openHAB, außer Player und den dazugehörigen Multimedia-Widgets, ohne besondere Notationen. Nur folgende Itemangaben müssen, abweichend zur Doku, eingehalten werden:
- basic.color: Das openHAB-Coloritem darf nur bei item_r_h angegeben werden. Alle anderen Itemangaben müssen leer bleiben und das Colormodel muss 'hsv' sein.
- device.blind: Das openHAB-Rollershutteritem darf nur bei item_pos angegeben werden und, wenn man auch einen Stop-Button haben möchte, zusätzlich als item_stop. Alle anderen Itemangaben müssen leer bleiben.
- plot.period: Als Aggregationsmode wird nur 'raw' unterstützt und muss dementsprechend so angegeben werden. Weiter wird auch die Option "count" zur Limitierung der Datensätze nicht unterstützt und steuert lediglich den Highcharts-Boost. OpenHAB liefert vom gewählten Zeitraum immer alle verfügbaren Datensätze. Je nach Umfang kann sich das negativ auf die Leistung auswirken.


Die Rollershutterposition und Dimmervalues (DPT 5.001) kommen von openHAB in Prozentangaben (0 - 100). Dadurch muss in den Widgets bei 'max' 100 angegeben werden, z. Bsp.:
- {{ device.blind('', '', '', 'RollershutterItem', 'RollershutterItem', '', '', 0, 100, 1) }}
- {{ device.dimmer('', '', 'DimmerItem', 'DimmerItem', 0, 100, 1) }}

Wenn man Prozentwerte (DPT 5.001) auch anderweitig verwenden möchte/muss, z. Bsp. für Luftfeuchte, dann muss man in openHAB dafür ein Item mit Type "Dimmer" verwenden. Der Type des verlinkten KNX-Thingchannel kann trotzdem "Number" sein, es muss aber der DPT 5.001 (5.001:<1/2/3) angegeben werden. Nur so kommen von openHAB auch verwendbare Prozentangaben (0 - 100). Verwendet man ein Item mit Type Number kommen von openHAB kalkulatorische Prozentwerte im Bereich 0.00 bis 1.00. 

Wenn der Browser EventListeners unterstützt (liegt am Browser und ob die Authentifizierug mit openHAB verwendet wird), werden Widgets in Echtzeit aktualisiert, ansonsten jede Sekunde neu abgefragt. Existiert ein Plot ohne Endzeitpunkt (tmax = 'now') und das betreffende Item wird aktualisiert, so wird auch der Plot aktualisiert, sofern die letzte Aktualisierung länger als 10 Sekunden zurück liegt, um Daueraktualisierungen von Plots bei schnellen Wertveränderungen zu vermeiden.