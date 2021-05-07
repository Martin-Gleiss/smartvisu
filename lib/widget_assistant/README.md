# smartvisu - Widget Assistant

## Table of Content
1. [How it works](#howitworks)
2. [ChangeLog](#ChangeLog) <sup><span style="color:red"> **Update**</span></sup>
3. [Hot-Keys](#hotkeys) <sup><span style="color:red"> </span></sup>
4. [Known issues](#issues) <sup><span style="color:red"> </span></sup>
5. [Logics to create masteritem.json from shNG](#logic_shng) <sup><span style="color:red"> **new**</span></sup>
6. [Script to create masteritem.json for FHEM](#script_fronthem) <sup><span style="color:red"> **new**</span></sup>

<a name="howitworks"/></a>
## How it works

This tool should help you to create widgets for your smartvisu-Web-Interface.
It will assist you with autocompletes for widgets, items, icons, and colors.
After you have selected a widget (like basic.symbol...) you will get a tooltip for this kind of widget. The actual parameter is highlighted in red and all the available details will be shown in the tooltip-window.
For icons and colors you will see a preview in the tooltip-window.
After completing the wiget you can render it in a new window. The widget in the rendered window is fully working, except there is an error in the created widget, you will get a TWIG-Error.
The final widget including the brackets "{{" + "}}" will be stored on rendering to the clipboard.
You can paste the widget-code directly to your html-file.

Right now you can render multiple widgets, you have to separate the different widgets
by a <strong><code>\<br\></code></strong>-TAG

### Example :

<code>
<p>plot.period('', ['licht.og.terrasse.screens.warm.dimmen', 'licht.og.terrasse.screens.kalt.dimmen', 'licht.og.terrasse.decke.dimmen'], 'max', '1w', 'now', '0', '110', '1000', ['Screens warm', 'Screens kalt', 'Decke'], ['#daa', '#aad', '#955'], ['stair', 'stair', 'stair'], ['Uhrzeit', 'Helligkeit'], 'advanced', '', '', '', '', '', { yAxis: [ { tickInterval: 40 } ], legend: {align: 'right', verticalAlign: 'top', y: 50, layout: 'vertical'}, chart: { marginRight: 110} })<p>
<strong>&lt;br&gt;</strong>
<p>basic.stateswitch('','OG.Bad.Licht','midi','','light_ceiling_light','Licht Bad','','','','','')</p>
<strong>&lt;br&gt;</strong>
<p>quad.dimmer('Lueftungsstufe1', 'Lüftungsstufe', 'Haustechnik.Lueftung', 'Haustechnik.Lueftung.stufe', 0, 100, 5, icon.ventilation(), icon.ventilation('','','Haustechnik.Lueftung.stufe'), '', '', '',                          0, 100,'','','','','','','','','','','','','', ['switch', 'value_popup']) 
</p>
</code>



<a name="ChangeLog"/></a>
## Change-Log

#### 2021.05.01 - Version 1.2.0

- added support for all valid values of widget-types from twig-docu
- some optical changes
- added widget specific colours to autocomplete dict for colors (for example 'hidden','blank' for basic.print)

#### 2021.01.18 - Version 1.1.0
- changed handling for "render in new window" - if there is no Window a new one will be opened, else the opened window would be refreshed, also if there is a twig error
- more fixes for "nasty", "nested" widgets
- some optical changes

#### 2020.11.08 - Version 1.0.0
- added support for multi-widget creation (widgets have to be separated by <strong>&lt;br&gt;</strong>-TAG)
- fixed problem for "nasty", "nested" widgets
- added check for all brackets closed before rendering


#### 2020.05.15 - Version 1.0.0
- added switching for autoclose quotes
- added filter for item-autocomplete based on item data-type
- added checkbox to open agiain new window for the preview
- added data-types to items in basic-widgets (basic.html)
- added alert when receiving "strange" widget-informations (most based on README.html-Files in /dropins/widgets-folder)


#### 2020.05.03 - Version 1.0.0
- added autocomplete dict for parameters with the following names "type", "mode",  "style", "colormodel", "orientation", "valueType" 

#### 2020.05.02 - Version 1.0.0
- set filter to *svg while collectin icons in /icon/ws/ ( There is a stylesheet in the folder)
- until no widget is selected the Widget-only dict is acive
- added Close-Button to the Tooltip-Window
- added closeBrackets feature for CodeMirror and solved problem with CSS 
- added direct copy of the final widget to the clipboard when rendering the widget

#### 2020.05.01 - Version 1.0.0
- added support for nested widgets like <pre><code>{{ basic.symbol('', 'bath.light.switch', '', icon.light('','','bath.light.value') ) }}
</code></pre>
- added bracket-matching
- added autoswitch to dict depending on parameter -> type / you can switch to a dict using the Hot-Keys
- removed deprecated widgets from widget generator

#### 2020.04.26 - Version 1.0.0

- added search in autocompletes with wildcard (a word with 3 chars will match all entries in the acitve dict like ```*your_chars*```
- added Hot-Key 'CTRL+Space' to activate the autocomplete-hint without entering a search key
- added preview in tooltip for colors and icons

#### 2020.04.25 - launch of Version 1.0.0

- Beta Version for tests distributed



## Requirements

actual smartvisu-Version - you can find it here

<a name="hotkeys"/></a>
## Hot-Keys
| Shortcut  |function   |
|---|---|
| STRG+0  | switch OFF autocomplete-Dict  |
| STRG+1  | switch ON autocomplete-Dict  |
| STRG+2  | only Widgets in autocomplete-Dict  |
| STRG+3 |  only Icons in autocomplete-Dict  |
| STRG+4 |  all in autocomplete-Dict  |
| STRG+5 |  only Colors in autocomplete-Dict  |
| STRG+6 |  autocomplete-Dict is OFF |
| STRG+7 |  switch ON/OFF autocomplete for Ouotes<sup><span style="color:red"> **(1)**</span></sup> - take some time to build the autocomplete |
| STRG+8  | only Items in autocomplete-Dict  |
| STRG+9 |  switch ON/OFF Wildcard search in autocomplete dict  |
| STRG+Space |  opens the actual autocomplete-Dict  |
| STRG+F |  find value in widgets  |
| STRG+SHIFT+R |  replace value in widgets - use ENTER to go to replacement-value  |

(1) when autocomplete for quotes is on - the autocomplete dict will return all values <strong>without</strong> quotes<br>
    when autocomplete for quotes is off - the autocomplete dictionary will return all values <strong>with</strong> quotes

<a name="issues"/></a>
## Known Issues

It is possible to render the new widget into the iframe on the actual page.
But this will destroy the loaded index.php. You will get in trouble when you want
to use the navigation of smartvisu again.
No solution right now.  You can reload the page with bypassing the cache,
then everthing is working again. (STRG+F5 / CTRL + Shift + R)


<a name="logic_shng"/></a>
## Logic to create masteritem.json from shNG

Only needed for smarthomeNG <= v1.7.2. As of v1.8 the smartvisu plugin writes the file as default.

<pre><code>
#!/usr/bin/env python3
# create_master_item.py
import json
from lib.item import Items
items = Items.get_instance()
items_sorted = sorted(items.return_items(), key=lambda k: str.lower(k['_path']), reverse=False)
item_list = []
for item in items_sorted:
    item_list.append(item._path + "|" + item._type )
f = open("/var/www/html/smartvisu/pages/<strong>YOUR_PAGES</strong>/masteritem.json", "w")
f.write(json.dumps(item_list))
f.close()
</code></pre>

<a name="script_fronthem"/></a>
## Script to create masteritem.json for FHEM

A script can be found in the fronthem / smartVISU Forum<br>
https://forum.fhem.de/index.php/topic,118508.msg1135044.html#msg1135044

