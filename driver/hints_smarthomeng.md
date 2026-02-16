Die IP-Adresse / Hostname und die Websocket-Ports für shNG müssen *immer* angegeben werden. Zudem muss der Hostname des smartVISU-Servers in einem neuen Feld eingetragen werden, sofern der Hostname
für den Aufruf der Visu verwendet wird, also z.B. "smarthome.local" anstatt "192.168.2.10". Falls noch eine zusätzlliche Adresse zur Verwendiung mit dem konfigurierten Port verwendet werden soll 
(z.B. bei Verwendung von Tunneln), kann diese manuell als "driver_address2" in die config.ini eingetragen werden.

Der Treiber, der im Konfigurationsmenü als „smarthomeNG“ angezeigt wird, verbindet sich dann wie folgt mit dem shNG Websocket:

- Ruft der Benutzer die Visu mittels IPv4-Adresse auf (z. B. http://192.168.2.10/smartVISU), dann verwendet der Treiber die Adresse und die Ports aus der Konfiguration.
- Wird die Visu per Hostname aufgerufen (z.B. http://smarthome.local/smartVISU), dann prüft der Treiber, ob der verwendete Hostname (im Beispiel „smarthome.local“) der konfigurierte SV-Hostname ist und verwendet in diesem Fall
  wieder die konfigurierte Adresse und die Ports.
- Beim Aufruf der Visu mit dem Hostnamen, der in driver_address2 eingetragen ist, wird diese Adresse zusemmen mit den konfigurierten Ports verwendet 
- entspricht der Hostname im Seitenaufruf nicht dem konfigurierten SV-Hostnamen oder driver_address2, dann geht der Treiber von einer externen Verbindung über Reverse Proxy aus und spricht den Websocket über den Hostnamen, 
  Port 80/443 und das Protokoll ws: / wss: an.

```
                      |        --------------------- Browser - Adresszeile ---------------------             | 
                      |     URL = IP     |  URL = Hostname  |  URL = Hostname          |  URL = Hostname     |
                      |                  |  Host = svHost   |  Host = driver_address2  |  unregistered Host  | 
----------------------+------------------+------------------+--------------------------+---------------------|
Verbindung            |  lokal / Tunnel  |  lokal / Tunnel  |  Tunnel                  |  Reverse Proxy      |
Beispiel: http://...  |  192.168.2.123   |  smarthome.local |  mydevice.mydyndns.de    |  mydyndns.de        |
----------------------+------------------+------------------+--------------------------+---------------------|
verwendete  Adresse:  |                  |                  |                          |                     |
         WS Addresse  |  config Host/IP  |  config Host/IP  |  driver_address2         |  Hostname           |
         WS Ports     |  config Ports    |  config Ports    |  config Ports            |  Ports 80 / 443     |