# Folder for custom dropins and overrides

## JavaScripts and cascading stylesheets
Any .js and .css file placed directly in dropins folder is loaded into your pages (in alphabetical order, after system files and before the ones in your pages folder).

## Page templates and overrides
You may place custom Twig html templates in here and use them in any of your pages (e.g. by `{% import 'foo.html' %}` or `{% extends 'bar.html' %}`).
System templates can be overridden by creating a template with same name in here (e.g. `base.html` in dropins overrides `pages/base/base.html`).

## Widgets
The widget folder .dropins/shwidgets is being used by SmarthomeNG page generation in the "smartvisu" plugin. The plugin empties the folder and places plugin-specific widgets there. 
Widgets placed there manually will be deleted. You should place your own widgets in the ./dropins/widgets folder. There, you can add documentation files for these widgets. 
If no documentation is available / needed you can place the widgets also in "pages/(yourPage)/widgets".

### Twig Macros
Any valid .html file in widgets folders gets imported as widget library. E.g. a macro `bar()` defined in `./dropins/widgets/foo.html` can be called in your pages by `{{ foo.bar() }}`.
Widget filenames have to be valid Twig/PHP variable names. They must not contain any non-alphanumeric characters (except underlines) and must not start with a number.
See the Wiki section on github for documentation on how to create your own widgets. An explicit import of custom widgets into the visu pages is not necessary and should be avoided. 
On the opposite widgets have to be imported for use inside other widgets. Use the namespace for importing: `{% import "@widgets/mywidget.html" as mywidget %}`. 
Avoid renaming of the widget during import as the template checker will not find renamed widgets. 

## Icons
You may place your black icons in `./dropins/icons/sw/` and their white counterpart in `./dropins/icons/ws/`.
Icons delivered by smartVISU get overridden if you use existing filenames. To make this work don't use icon0 nor any path in widgets, but just the filename.

To make SVG tintable by smartVISU, set fill and stroke by dedicated attributes and not by style (e.g. `<path fill="#FFF" stroke="#FFF"` instead of `<path style="fill: #FFF; stroke: #FFF;"`).
Hint: Shrinking the files using [SVGOMG](https://jakearchibald.github.io/svgomg/) with default settings this is replaced for you.

## Custom Language Files
For extension of the existing language files you can place your own .ini file in the `./dropins/lang` folder. smartVISU config page will find the file and show it in the language selector.
See readme.txt in the smartVISU/lang folder on how to format the custom language file and extend a base language.