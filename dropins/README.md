# Folder for custom dropins and overrides

## JavaScripts and cascading stylesheets
Any .js and .css file placed directly in dropins folder is loaded into your pages (in alphabetical order, after system files and before the ones in your pages folder).

## Page templates and overrides
You may place custom Twig html templates in here and use them in any of your pages (e.g. by `{% import 'foo.html' %}` or `{% extends 'bar.html' %}`).
System templates can be overridden by creating a template with same name in here (e.g. `base.html` in dropins overrides `pages/base/base.html`).

## Widgets

### Twig Macros
Any valid .html file in widgets folder gets imported as widget library. E.g. a macro `bar()` defined in `widgets/foo.html` can be called in your pages by `{{ foo.bar() }}`.
Widget filenames have to be valid Twig/PHP variable names. They must not contain any non-alphanumeric characters (except underlines) and must not start with a number.

#### Docstring ####
Every widget macro should be documented by a preceding docstring comment which is used to generate documentation and contains information for Template Checker.
This has to be right above the macro defintion and starts by `/**` and end with `*/`. Every line has to begin with a `*`.

The first line has to contain a short discription of the widget.

On the suceeding lines the parameters are describe in same order as they are defined in macro (the order is essential!).
Every of this line starts with the keyword `@param` followed by an expression in `{}` which contains the type, form, optionality and allowed values. This is followed by a description of the parameter. The description may have line breaks, but please note that subsequent lines may not start with a star `*`.

The type may be one of the following:
- id: Unique id
- image: An icon of the icons folder
- text: A string
- value: A number
- color: Any css color like #FF0000, rgb(255,0,0), hsl(0, 100%, 50%), red or icon1
- item: A backend item
- iconseries: A dynamic icon or a series icon (i.e. one with multiple states ending on _00, _10 etc.)
- type: A type of a button, one of 'micro', 'mini', 'midi', 'icon' or 'text'
- duration: A duration like 1h or 30s
- format: PHP sprint like expression
- formula: A JavaScript expression
- url: Any valid URL (absolute or relative)

Parameters which have to be a list are marked by suceeding square brackets: `@param {value[]}`
If the list-form is optional (i.e. a single value or a list is accepted) add a question mark in the brackets: `@param {value[?]}`

A parameter may be marked as optional by adding an equality sign after the type: `@param {text=}`
If the parameter has a default value, add it after the equality sign: `@param {text=hello}`. Remember: This is just for documentation purposes, the default value itself has to be set in your code.
Use the array form to set a list as default value: `@param {value[]=[0,1]}`

Some types can be limitted to discreet values by adding a list of allowed values in parentheses: `@param {text(left,right)}`
If this is used for *formula* or *type* the values are allowed in addition to the predefined ones; i.e. `@param {type(foo)}` allows 'micro', 'mini', 'midi', 'icon', 'text' or 'foo'

Complete example (basic.select):
```
/**
* Select a specific value (e.g. a scene)
*
* @param {id=} unique id for this widget (optional)
* @param {item} an item
* @param {type(menu)=menu} type: 'menu', 'micro', 'mini', 'midi', 'icon' (optional, default: menu)
* @param {value[]=[0,1]} list of values (optional, default [0,1])
* @param {image[]=} list of icons for every button (optional) - not supported for type 'menu'
* @param {text[]=} list of texts for every menu entry or button (optional)
* @param {color=icon1} the color for the on state of the buttons (optional, default: icon1) - not supported for type 'menu'
* @param {text(horizontal,vertical,none)=horizontal} orientation of the controlgroup: 'horizontal', 'vertical' or 'none' for seperate buttons (optional, default: 'horizontal') - not supported for type 'menu'
*/
{% macro select(id, item, type, value, icon, text, color_on, group) %}
...
{% endmacro %}
```

### Script and styles
In addition any .css and .js file in this folder gets loaded. The stylesheets can contain widget specific styles, the JavaScripts are meant to implement logic of the widgets. This is based on [jQuery UI Widget Factory](http://api.jqueryui.com/jQuery.widget/) and have to contain a structure like the following:
```JavaScript
$.widget("sv.foo_bar", $.sv.widget, {

	initSelector: '[data-widget="foo.bar"]',

	options: {
		myFirstParam': ''
		...
	},

	_create: function() {
		this._super();
		...
	},
	
	_update: function(response) {
		...
	},

	_repeat: function() {
		...
	},

	_events: {
		'click': function(ev) {
			...
		}
		...
	},

});
```
(Replace `foo` both times by your widget library name and `bar` by macro name.)

Available members are:
* `initSelector: '...'` an jQuery selector of widget's HTML node.
* `options: { }` has to contain all parameters which are set by widget macro as data-attribute in HTML.  
These can then be accessed in code by `this.options...`. Hyphens get replaced by camel case (e.g. `data-my-first-param="..."` in HTML turns into `this.options.myFirstParam`).  
The HTML node itself can be accessed by `this.element`.
* `_create: function() { }` *(optional)*  
Is executed on first creation of the widget instance. If you override this, mind to call `this._super();` in it.
* `_update: function(response) { }` 
Triggered if an item value has been changed. Variable `response` contains value of widget's item(s).
* `_repeat: function() { }` *(optional)*  
Triggerd after the seconds defined in the attribute `data-repeat` on widget's html.
* `_events: { }` *(optional)*  
Collection of any browser or jQuery Mobile event to be bound on widget's HTML node.
* `_allowPartialUpdate: true` *(optional)*
If this is set, the `_update` method can receive (after first intitialisation) new points of a series separately and without checking if all other items do have a value. (This replaces the former `point` event.)

 
## Icons
You may place your black icons in `icons/sw/` and their white counterpart in `icons/ws/`.
Icons delivered by smartVISU get overriden if you use existing filename. To make this work don't use icon0 nor any path in widgets, but just the filename.

To make SVG tintable by smartVISU set fill and stroke by dedicated attributes and not by style (e.g. `<path fill="#FFF" stroke="#FFF"` instead of `<path style="fill: #FFF; stroke: #FFF;"`).
Hint: Shrinking the files using [SVGOMG](https://jakearchibald.github.io/svgomg/) with default settings this is replaced for you.
