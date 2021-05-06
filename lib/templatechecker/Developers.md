# SmartVISU Template Checker Developer Documentation

This file describes the general syntax to configure the widget parameter checker

# General syntax
The widget parameter configuration is a multilevel associative array with the following structure:

	$variable = array(
		'[variable].[widget]' => array(
			[parameter index] => array(
				'type' => '[type]',
				'[additional setting]' => [value],
				[... more elements for further settings ...]
			),
			[... more elements for further parameter indexes ...]
		),
		[... more elements for further widgets ...]
	);

The array will be filled by the twig_docu() function in ./lib/functions_twig.php which collects all widgets residing in the widget folders 
which are defined in the loader path for smartVISU. 

`[parameter index]` is a zero based numeric value: 0 means the first parameter, 1 the second, 2 the third, ...

`'[type]'` indicates the type of the parameter. Supported types are described in the next section. Parameter types and all other settings 
are collected from the widgets docstring. See description in the subsequent sections.

# Widget Parameter Configuration
  
The docstring of a widget must contain descriptions for each individual parameter - starting with the identifier `@param`. The parameter 
name is defined in the arguments list of the macro call. The sequence of arguments and parameter descriptions must correspond.

```
/**
* example for docstring
*
* @param definition for first_argument
* @param definition for second_argument
* @param definition for third_argument
*
* @author wvhn
*/
{% macro example(first_argument, second_argument, third_argument) &}
```  

The parameter description is composed as follows: `* @param {type[array form](valid values)<optional><default>}`, e.g. 

  `* @param {text[?](text1,text2)=text1}`

* `type`: parameter type is described in the subsequent section
* `array form`: `[]` = parameter must be given as array / `[?]` parameter may be given as single value or as array
* `valid values`: a sequence of valid parameter values in brackets (in some cases additional to predefined values - see below).
* `optional`: a `=` indicates whether a parameter is optional. If missing, it is mandatory.
* `default`: a default value can be defined for optional parameters


## Parameter type 'id'
Parameter is the id of the widget. In some cases, an id is required to be unique within a file. The template checker reports if an id is being used multiple
times within a file

## Parameter type 'image'
Parameter is an image. Existence of the image will be checked. Missing images will be reported.  
Valid values are:

* smartVISU inline pictures ('arrow-l', 'arrow-r', 'arrow-u', 'arrow-d', 'delete', 'plus', 'minus', 'check', 'gear', 'refresh', 'forward', 'back', 'grid', 'star', 'alert', 'info', 'home', 'search')
* Remote images ("http://...", "https://...")
* Local images (paths "icon0" and "icon1" are respected,  icons without path are looked up in the "icon0" directory)
* dynamic icons (icon.xyz widgets) and basic.symbol are also valid "images"

## Parameter type 'text'
Parameter is an arbitrary text.

**Additional settings:**  

* `'valid_values' => array([list of values])`  
Optional.  
If set, the value of the parameter must be one of the values in `[list of values]`. Case sensitive check!

## Parameter type 'value'
Parameter is a numeric value. Any non-numeric values will be reported as errors.

**Additional settings:**  

* `'valid_values' => array([list of values])`  
Optional.  
If set, the value of the parameter must be one of the values in `[list of values]`.

## Parameter type 'percent'
Parameter is a percentage value consisting of a numeric value and a '%'. Any non-matching values will be reported as errors.

**Additional settings:**  

* None

## Parameter type 'color'
Parameter is a color

Valid predefined values are:

* any known named html color (e.g. "red", "green", "saddlebrown", "tomato", ...)
* any 3 or 6 digit hexadecimal color value prefixed by "#" (e.g. "#f00", "#0f0", "#8b4513", "#ff6347", ...)

**Additional settings:**  

* `'valid_values' => array([list of values])`  
Optional.  Extends the predefined set of values.
If set, the value of the parameter must be among the predefined values OR in the list of valid values. Case sensitive check!
`icon0` and `icon1` are not accepted by some widgets. They need to be defined here.
Further valid values can be `hidden` or `blank` e.g. in basic.stateswitch or basic.symbol

## Parameter type 'item'
Parameter indicates an item.  
Checks of items and item types are performend based on a file 'masteritem.json' which needs to be provided
either automatically by tha backend or manually by the user. The check vaidates whether the used items are available
and their types are matching the variable types of the widget.

Format of the masteritem file:
["eg|foo", "eg.entrance|foo", "eg.entrance.door|bool", "eg.entrance.light|foo", "eg.entrance.light.ceiling|num"]

Valid values are
* foo
* bool
* num
* str
* list
* dict
  
**Additional settings:**  

* None


## Parameter type 'type'
Parameter is a button type.  
Valid predefined values are

* micro
* mini
* midi
* icon

**Additional settings:**  

* `'valid_values' => array([list of values])`  
Optional.  Extends the predefined set of values.
If set, the value of the parameter must be among the predefined values OR in the list of valid values. Case sensitive check!
basic.symbol e.g. uses 'btn-micro'... which are defined as valid here.

## Parameter type 'duration'
Parameter requires [duration format](http://docu.smartvisu.de/2.7/index.php?page=misc/fundamentals) .

**Additional settings:**  

* `'valid_values' => array([list of values])`  
Optional.  Extends the predefined set of values.
If set, the value of the parameter must be among the predefined duration values OR in the list of valid values. Case sensitive check!
plot.period e.g. uses 'advanced' for zooming options which is defined as valid here.

## Parameter type 'format'
Parameter is a display format. Currently the checks for the type 'text' are performed.

## Parameter type 'formula'
Parameter is a formula e.g. for basic.symbol. Currently the checks for the type 'text' are performed.

## Parameter type 'url'
Parameter is an url. Currently the checks for the type 'text' are performed.

## Parameter type 'unspecified'
Parameters of this type will not be checked.

## Parameter type 'iconseries'
Parameter defines an iconseries.  
Valid values:

* Any known dynamic icon of SmartVISU
* Set of 10 icons in SmartVisu icon directory.  
As parameter "\[filename\]_00.svg" needs to be given.  
Files "\[filename\]_10.svg", "\[filename\]_20.svg", "\[filename\]_30.svg", ...,  "\[filename\]_90.svg" and "\[filename\]_100.svg" are being used.  
Their existence is checked by the template checker

This may be **deprecated** in future versions since basic.shifter is deprecated already.

**Additional settings:**  

* None
