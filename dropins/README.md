# Folder for custom dropins and overrides

## JavaScripts and cascading stylesheets
Any .js and .css file placed directly in dropins folder is loaded into your pages (in alphabetical order, after system files and before the ones in your pages folder).

## Page templates and overrides
You may place custom Twig html templates in here and use them in any of your pages (e.g. by `{% import 'foo.html' %}` or `{% extends 'bar.html' %}`).
System templates can be overridden by creating a template with same name in here (e.g. `base.html` in dropins overrides `pages/base/base.html`).

## Widgets
The widget folder is being used by SmarthomeNG page generation plugin "visu-smartvisu". The plugin empties the folder and places plugin-specific widgets there. Widgets placed here manually will be deleted. If you are using the plugin "visu-smartvisu" you should place your own widgets in the widgets folder "pages/(yourPage)/widgets".

### Twig Macros
Any valid .html file in widgets folder gets imported as widget library. E.g. a macro `bar()` defined in `widgets/foo.html` can be called in your pages by `{{ foo.bar() }}`.
Widget filenames have to be valid Twig/PHP variable names. They must not contain any non-alphanumeric characters (except underlines) and must not start with a number.
See the Wiki section on github for documentation on how to create your own widgets.

## Icons
You may place your black icons in `icons/sw/` and their white counterpart in `icons/ws/`.
Icons delivered by smartVISU get overridden if you use existing filenames. To make this work don't use icon0 nor any path in widgets, but just the filename.

To make SVG tintable by smartVISU, set fill and stroke by dedicated attributes and not by style (e.g. `<path fill="#FFF" stroke="#FFF"` instead of `<path style="fill: #FFF; stroke: #FFF;"`).
Hint: Shrinking the files using [SVGOMG](https://jakearchibald.github.io/svgomg/) with default settings this is replaced for you.
