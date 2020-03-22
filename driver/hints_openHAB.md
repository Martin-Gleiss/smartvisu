Hinweise zum neuen openHAB 2 driver:

Der Treiber unterstützt alle Widgets, Devices und Plots von smartVISU 2.9 und alle Items aus openHAB 2, außer Player und Multimedia-Widgets, ohne besondere Notationen. Nur folgende Itemangaben müssen, abweichend zur Doku, eingehalten werden:

- basic.color: Das openHAB2-Coloritem darf nur bei item_r_h angegeben werden. Alle anderen Items müssen leer bleiben und das Colormodel muss 'hsv' sein.
- device.blind: Das openHAB2-Rollershutteritem darf nur bei item_pos angegeben werden und, wenn man auch einen Stop-Button haben möchte, zusätzlich bei item_stop. Alle anderen Items müssen leer bleiben.

Wenn der Browser EventListeners unterstützt, werden aktuelle Widgets in Echtzeit aktualisiert, ansonsten jede Sekunde neu abgefragt. Existiert ein Plot mit tmax = now und das betreffende Item wird aktualisiert, so wird auch der Plot aktualisiert, sofern die letzte Aktualisierung länger als eine Minute her ist.

Die Rollershutterposition und Dimmervalues kommen von openHAB 2 in Prozentangaben (0 - 100) und werden durch den Treiber in Werte (0 - 255) umgewandelt. Somit entfällt auch die Angabe von min und max bei den Widgets, wenn man den vollen Bereich benutzen möchte.
