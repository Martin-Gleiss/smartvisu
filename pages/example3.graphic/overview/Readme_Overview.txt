Readme Overview
---------------

Hinweise zur Erstellung einer "Übersichtsseite":

1. Benötigt werden folgende Dateien im pages/eigeneVisu-Verzeichnis:
   - widgets/overview.html
   - mindestens ein Hintergrundbild vorzugshalber als svg-Grafik oder ein jpg-Foto
   - Als Grundlage für eigene Seiten bietet sich eine der vorhandenen Seiten an.
     (overview_eg.html, overview_dg.html, overview_garten.html)
   - visu.css 
   
   Wenn es nicht als Block, d.h. als "normales" Widget in einer vorhandenen Seite verwendet werden soll, sondern wie auf den Beispielseiten,
   dann werden noch zusätzlich diese Dateien benötigt:
   - base.html		-> hier die Seitentitel anpassen
   - menu.html		-> das Menü im Fußbereich (footer)
   - menu_popup.html	-> der Inhalt des Menüs rechts oben

2. Aufbau von eigenen Seiten
   - Mindestens folgende Zeilen werden bei einer Block-Dartstellung benötigt:

     {% import "widgets/overview.html" as ov %}
	 {% block content %}
	 
	 <div class="html">
		<style>		
		  /* Overview */
		  .overview { 
			position: relative; 
			margin: 0px;
		  }
	    </style>

		<div class="ui-grid-solo">
			<div class="ui-bar-c ui-li-divider ui-corner-top">Titel</div>
			<div class="ui-fixed ui-body-a ui-corner-bottom">
			<div class="overview">
			
				<!-- Background picture -->
				{{ ov.background ('background_eg', 'pages/eigeneSeite/images/background.svg') }}
			
				Hier kommen die einzelnen Widgets hin...
			
			</div>
			</div>
		</div>

     Für die Einbindung als zentrales Element, wie in den Beispielseiten, kann der benötigte Code den oben genannten Dateien entnommen werden.
			
   - Welche Widgets gibt es?
	 Viele Basic-Widgets stehen zur Verfüngung, um eine Übersicht der Widgets und deren Parameter zu haben 
	 die Datei widget_overview.html in einem Texteditor öffnen.
	 Jedes Widget ist dort mit einer Auflistung der Parameter aufgeführt.

   - Besonderheiten:
     - Alle ov-Widgets benötigen mindestens einen left und top Parameter, 
       d.h. eine Angabe in Prozent für den Abstand vom linken Rand und
       vom oberen Rand der Grafik. Der Abstand bezieht sich immer auf 
       den Mittelpunkt eines Objekts.
     - Zusätzlich gibt es einen optionalen Parameter "hide", 
       wenn dieser Parameter auf 1 gesetzt ist, dann wird das Widget bei kleinen Bildschirmen ausgeblendet.
     - Häufig wird auch ein Parameter "type" verwendet, dieser bestimmt die Größe eines Buttons
       wie auch bei den normalen Basic-Widgets, aber zusätzlich mit einem
       vierten Wert "icon", dann wird nur das Symbol ohne Button angezeigt.
     - Ein weiterer zusätzlicher Parameter ist "title, info oder text" und entspricht normalerweise
       dem Text der erscheint wenn die Maus über einem Button länger
       verweilt.

3. Wie bekomme ich den Prozentwert für die left- und top-Parameter heraus?
   Z.B. mit folgenden Vorgehen:
   - Benötigt wird ein Grafikprogramm wie z.B. GIMP (im Folgenden verwendet)
   - Ein Hintergrundbild z.B. mit Inkscape erstellen und als svg-Grafik speichern.
   - Anschließend das Bild mit GIMP öffnen und es erscheint ein kleines Popup-Fenster
     "Skalierbare Vektorgrafik rendern"
   - Dort folgende Werte eintragen, unabhängig von der tatsächlichen Größe:
      1. Die Beschränkung der Seitengröße aufheben (Kettensymbol neben dem X- und Y-Anteil)
      2. Breite: 1000 Pixel
      3. Höhe: 1000 Pixel
      4. mit OK übernehmen
   - Ein rechteckiges Bild wird verzerrt angezeigt und wenn jetzt 
     die Maus über das Bild bewegt wird, dann steht links unten die aktuelle Position.
   - Der linke Wert ist der Abstand von links und der rechte Wert der Abstand von oben.
   - Diese Werte bei den left und top Parametern mit einer Kommastelle (Punkt) und Prozent eingeben, 
     z.B. bei Gimp wird an der Zielposition "386, 96" angezeigt, dann ist: 
     left="38.6%" und top="9.6%"
   - Wenn alles richtig ist, dann sollte das gewünschte Widget an der 
     richtigen Position angezeigt werden.
   
4. Nachteile/Probleme
   - Die Hintergrundgrafik darf in der Größe später nicht mehr verändert werden, 
     ansonsten müssen alle left- und/oder top-Parameter angepasst werden.

5. Ausblick/Anregungen
   - Bei einem Grundriss könnten auch imageMaps verwendet werden, um einen 
     ganzen Raum als Klick/Touch-Fläche für einen Aufruf der Detailseite 
     zu verwenden.
   - Die Buttons nicht zu dicht anordnen um ein zu starkes Überlappen bei 
     kleinen Bildschirmen zu vermeiden.
   - Bei weniger wichtigen Buttons/Informationen den "hide" Parameter auf 
     1 setzen um ein "überfüllen" z. B. auf einem Smartphone zu vermeiden.
   - Möglichst wenige Plots verwenden, die Ladezeit steigt ansonsten 
     stark an.
