/*
 * Schnee-Script
 * @author Oliver Schlöbe <scripts@schloebe.de>
 * @link http://www.schloebe.de/scripts/schnee-script/
 */

<!--
var no = 15; // Anzahl der Schneeflocken
var speed = 40; // "Schnei-Geschwindigkeit"; je kleiner die Zahl, um so schneller fallen die Flocken
var snowflakepath = "lib/season/pics"; // Bild der Schneeflocke, beliebig
// ***** Ab hier nichts mehr ändern! ********************
var ns4up = (navigator.appName=="Netscape" && navigator.appVersion.charAt(0)=="4") ? 1 : 0; // Browser Tester
var ie4up = (document.all) ? 1 : 0;
var ns6up = (document.getElementById&&!document.all) ? 1 : 0;
var dx, xp, yp; // Variablen für Koordinaten und Position
var am, stx, sty; //Variablen für Amplitude und Schrittweite
var i, doc_width = 800, doc_height = 800;

if( ns4up || ns6up ) { // Bildschirm-Auflösung holen, Netscape-Funktion
	doc_width = self.innerWidth;
	doc_height = self.innerHeight;
} else if( ie4up ) { // Bildschirm-Auflösung holen, Internet Explorer-Funktion
	doc_width = document.body.clientWidth;
	doc_height = document.body.clientHeight;
}
doc_height = (doc_height==0) ? document.documentElement.clientHeight : doc_height;

dx = new Array();
xp = new Array();
yp = new Array();
am = new Array();
stx = new Array();
sty = new Array();

for( i = 0; i < no; ++ i ) {
	dx[i] = 0; // Koordinaten-Variable setzen
	xp[i] = Math.random()*(doc_width-50); // Position-Variable setzen
	yp[i] = Math.random()*doc_height;
	am[i] = Math.random()*20; // Amplituden-Variable setzten
	stx[i] = 0.02 + Math.random()/10; // Variable für Schrittweite setzen
	sty[i] = 0.7 + Math.random(); // Variable für Schrittweite setzen
	// snowflake = snowflakepath + '/snow' + Math.round((Math.random() * 5)) + '.gif';
    snowflake = snowflakepath + '/snow' + (i % 4 + 1) + '.gif';
    
	if( ns4up ) {
		if (i == 0) {
			document.write("<layer name=\"dot"+ i +"\" left=\"15\" ");
			document.write("top=\"15\" visibility=\"show\"><img src=\"");
			document.write(snowflake + "\" border=\"0\"></layer>");
		} else {
			document.write("<layer name=\"dot"+ i +"\" left=\"15\" ");
			document.write("top=\"15\" visibility=\"show\"><img src=\"");
			document.write(snowflake + "\" border=\"0\"></layer>");
		}
	} else if( ie4up || ns6up ) {
		if (i == 0) {
			document.write("<div id=\"dot"+ i +"\" style=\"position: ");
			document.write("absolute; z-index: "+ i +"; visibility: ");
			document.write("visible; top: 15px; left: 15px;\"><img src=\"");
			document.write(snowflake + "\" border=\"0\"></div>");
		} else {
			document.write("<div id=\"dot"+ i +"\" style=\"position: ");
			document.write("absolute; z-index: "+ i +"; visibility: ");
			document.write("visible; top: 15px; left: 15px;\"><img src=\"");
			document.write(snowflake + "\" border=\"0\"></div>");
		}
	}
}

// ----------------------------------------------------------------------
// Haupt-Animations-Funktion für Netscape
function snowNS() {
	for( i = 0; i < no; ++ i ) {
		yp[i] += sty[i];
		if( yp[i] > doc_height-50 ) {
			xp[i] = Math.random()*(doc_width-am[i]-30);
			yp[i] = 0;
			stx[i] = 0.02 + Math.random()/10;
			sty[i] = 0.7 + Math.random();
			doc_width = self.innerWidth;
			doc_height = self.innerHeight;
			doc_height = (doc_height==0) ? document.documentElement.clientHeight : doc_height;
		}
		dx[i] += stx[i];
		document.layers["dot"+i].top = yp[i];
		document.layers["dot"+i].left = xp[i] + am[i]*Math.sin(dx[i]);
	}
	setTimeout("snowNS()", speed);
}

// ----------------------------------------------------------------------
// Haupt-Animations-Funktion für Internet Explorer
function snowIE() {
	for( i = 0; i < no; ++ i ) {
		yp[i] += sty[i];
		if( yp[i] > doc_height-50 ) {
			xp[i] = Math.random()*(doc_width-am[i]-30);
			yp[i] = 0;
			stx[i] = 0.02 + Math.random()/10;
			sty[i] = 0.7 + Math.random();
			doc_width = document.body.clientWidth;
			doc_height = document.body.clientHeight;
			doc_height = (doc_height==0) ? document.documentElement.clientHeight : doc_height;
		}
		dx[i] += stx[i];
		document.all["dot"+i].style.pixelTop = yp[i];
		document.all["dot"+i].style.pixelLeft = xp[i] + am[i]*Math.sin(dx[i]);
	}
	setTimeout("snowIE()", speed);
}

// Haupt-Animations-Funktion für Netscape6 und Mozilla
function snowNS6() {
	for( i = 0; i < no; ++ i ) {
		yp[i] += sty[i];
		if( yp[i] > doc_height-50 ) {
			xp[i] = Math.random()*(doc_width-am[i]-30);
			yp[i] = 0;
			stx[i] = 0.02 + Math.random()/10;
			sty[i] = 0.7 + Math.random();
			doc_width = self.innerWidth;
			doc_height = self.innerHeight;
			doc_height = (doc_height==0) ? document.documentElement.clientHeight : doc_height;
		}
		dx[i] += stx[i];
		document.getElementById("dot"+i).style.top = yp[i]+"px";
		document.getElementById("dot"+i).style.left = xp[i] + am[i]*Math.sin(dx[i])+"px";
	}
	setTimeout("snowNS6()", speed);
}

if( ns4up ) {
	snowNS();
} else if( ie4up ) {
	snowIE();
}else if( ns6up ) {
	snowNS6();
}
// End -->