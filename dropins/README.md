# Folder for custom dropins and overrides

## JavaScripts and cascading stylesheets
Any .js and .css file placed directly in dropins folder is loaded into your pages (in alphabetical order, after system files and before the ones in your pages folder).

## Page templates and overrides
You may place custom Twig html templates in here and use them in any of your pages (e.g. by `{% import 'foo.html' %}` or `{% extends 'bar.html' %}`).
System templates can be overridden by creating a template with same name in here (e.g. `base.html` in dropins overrides `pages/base/base.html`).

## Widgets
Any valid .html file in widgets folder gets imported as widget library. E.g. a macro `bar()` defined in `widgets/foo.html` can be called in your pages by `{{ foo.bar() }}`.
Widget filenames have to be valid Twig/PHP variable names. They must not contain any non-alphanumeric characters (except underlines) and must not start with a number.

In addition any .css and .js file in this folder gets loaded. The stylesheets can contain widget specific styles, the JavaScripts are meant to implement logic of the widgets and have to contain a structure like the following:
```
$(document).on('pagecreate', function (pevent) {
	$(pevent.target).find('[data-widget="foo.bar"]').on( {
		'update': function (event, response) {
			event.stopPropagation(); // important for performance reasons
			...
		},
		'click': function(event) {
			...
		},
		...
	});
}):s
```
Available events are:
* `'update': function(event, response) { }`
 Triggered if an item value has been changed. Variable `response` contains value of widget's item(s).
* `'draw': function (event) { }`
 Triggered for svg when they got loaded.
* `'point': function(event, response) { }`
 Triggered for plots if the plot is already drawn and just a new point has been added to the series.
* `'repeat': function(event) { }`
 Triggerd after the seconds defined in the attribute `data-repeat` on widget's html.
* `'change'`, `'click'` ...
 Any browser or jQuery Mobile event.
 
## Icons
You may place your black icons in `icons/sw/` and their white counterpart in `icons/ws/`.
Icons delivered by smartVISU get overriden if you use existing filename. To make this work don't use icon0 nor any path in widgets, but just the filename.

To make SVG tintable by smartVISU set fill and stroke by dedicated attributes and not by style (e.g. `<path fill="#FFF" stroke="#FFF"` instead of `<path style="fill: #FFF; stroke: #FFF;"`).
Hint: Shrinking the files using [SVGOMG](https://jakearchibald.github.io/svgomg/) with default settings this is replaced for you.