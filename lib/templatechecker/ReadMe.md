#SmartVISU Template Checker

Check SmartVISU template files

##Functionality##
Currently the following checks are performed:

* __Basic html checks:__ Issues found while parsing the html file are reported
* __IMG tag:__ Check if image is existing, parameters {{icon0}} and {{icon1}} are being considered
* __Widget check:__ Check parameters of known widgets

##Requirements for successful usage##
For a successful usage of the template checker you, there are some requirements regarding your templates:

* __When using {% import "\[file\]" as \[variable\] %}, name the variable always as in the documentation:__  
The variable will become part of the widget name. If you use a different variable name, the widget configuration may not be found
and you might get an error due to an unknown widget.  
In general the variable should reflect the file name, so if you e.g. import "icon.html" the variable should be "icon".


* __When using own widgets:__  
Import own widgets to different variable names than standard widgets to avoid name conflicts with the standard widgets.
Own widgets are normaly reported as unknown widgets. If you want to have your own widgets checked, too, add file called
"templatechecker.customwidgets.php" containing the widget information for your custom widgets to your page directory.
A description of the widget parameter configuration can be found in file [Developers.md](Developers.md) 

##Cases which could not be fully checked##
There are some cases in which a template file can not be successfully checked, even if it does not contain any issues.
This is due to the fact that a template files is NOT a "standard HTML" file but an Twig template file.

Known issues are as following:

* Twig comments ( "/* \[...\] */" ) may be reported as invalid html
* Complex combinations of html and twig functions may cause the html parser to report invalid html
* Using variables for parameters of widgets may cause the checker to report invalid variable values

The last two points mainly affect files containing own widgets. Normal template files should not be affected by these issues.
