# smartvisu - Widget Constructor

## Table of Content
1. [How it works](#howitworks)
2. [ChangeLog](#ChangeLog) <sup><span style="color:red"> **new**</span></sup>
3. [Hot-Keys](#hotkeys) <sup><span style="color:red"> **new**</span></sup>
4. [Known issues](#issues) <sup><span style="color:red"> **new**</span></sup>

<a name="howitworks"/></a>
## How it works

This tool should help you to create widgets for your smartvisu-Web-Interface.
It will assist you with autocompletes for widgets, items, icons, and colors.
After you have selected a widget (like basic.symbol...) you will get a tooltip for this kind of widget. The acutal parameter is highlighted in red and all the available details will be shown in the tooltip-window.
For icons and colors you will see a preview in the tooltip-window.
After completing the wiget you can render it in a new window. The widget in the rendered window is fully working, except there is an error in the created widget, you will get a TWIG-Error.
The final widget including the brackets "{{" + "}}" will be stored on rendering to the clipboard.
You can paste the widget-code directly to you html-file.


<a name="ChangeLog"/></a>
## Change-Log

#### 2020.05.02 - Version 1.0.0
- set filter to *svg while collectin icons in /icon/ws/ ( There is a stylesheet in the folder)
- until no widget is selected the Widget-only dict is acive
- added Close-Button to the Tooltip-Window
- added closeBrackets feature for CodeMirror and solved problem with CSS 

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
| STRG+1  | only Items in autocomplete-Dict  |
| STRG+2  | only Widgets in autocomplete-Dict  |
| STRG+3 |  only Icons in autocomplete-Dict  |
| STRG+4 |  all in autocomplete-Dict  |
| STRG+5 |  only Colors in autocomplete-Dict  |
| STRG+6 |  autocomplete-Dict is OFF |
| STRG+9 |  switch ON/OFF Wildcard search in autocomplete dict  |
| STRG+Space |  opens the actual autocomplete-Dict  |

<a name="issues"/></a>
## Known Issues

It is possible to render the new widget into the iframe on the actual page.
But this will destroy the loaded index.php. You will get in trouble when you want
to use the navigation of smartvisu again.
No solution right now.  You can reload the page with bypassing the cache,
then everthing is working again. (STRG+F5 / CTRL + Shift + R)
