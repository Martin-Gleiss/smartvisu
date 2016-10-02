#SmartVISU Template Checker Developer Documentation

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

`'[variable].[widget]'` has to be all lowercase, independent from the case of the actual variable/widget name.

`[parameter index]` is a zero based numeric value: 0 means the first parameter, 1 the second, 2 the third, ...

`'[type]'` indicates the type of the parameter. Supported types are described in the next section.

Valid values for `'[additional setting]'` depend on `'[type]'`. They are described in the next section, too.

If you want an widget not to be reported as unknown, but not to be checked either, just assign an empty array to `'[variable].[widget]'`.

# Widget Parameter Configuration

* `'type' => '[type]'`  
Type of parameter. See below for valid values.

## General settings, applicable for all types ofparameters
* `'optional' => [TRUE|FALSE]`  
Optional, Default: FALSE  
Set to TRUE if parameter is optional.  
If unset or FALSE, parameter is considered to be mandatory and will cause an error if parameter is missing or empty.


* `'default' => [value]`  
Optional.  
In case of optional parameters: Default-Value of parameter 

##Parameter type 'id'
Parameter is id of widget. Usually the id is required to be unique within a file. The template checker reports if an id is being used multiple
times within a file

**Additional settings:**  

* `'unique' => [TRUE|FALSE]`  
Optional, Default: TRUE  
Set to FALSE if the id given for an parameter is not required to be unique. 

##Parameter type 'image'
Parameter is an image. Existence of the image will be checked. Missing images will be reported.  
Valid values are:

* smartVISU inline pictures ('arrow-l', 'arrow-r', 'arrow-u', 'arrow-d', 'delete', 'plus', 'minus', 'check', 'gear', 'refresh', 'forward', 'back', 'grid', 'star', 'alert', 'info', 'home', 'search')
* Remote images ("http://...", "https://...")
* Local images (paths "icon0" and "icon1" are respected,  icons without path are looked up in the "icon0" directory)

**Additional settings:**  

* None

##Parameter type 'text'
Parameter is an arbitrary text.

**Additional settings:**  

* `'valid_values' => array([list of values])`  
Optional.  
If set, the value of the parameter must be one of the values in `[list of values]`. Case sensitive check!

##Parameter type 'value'
Parameter is an (numeric) value. Any non-numeric values will be reported as errors.

**Additional settings:**  

* `'min' => [minimum value]`  
Optional.  
Minimum value for parameter. Values less than this minimum value will be reported as error


* `'max' => [maximum value]`  
Optional.  
Maximum value for parameter. Values greater than this maximum value will be reported as error

##Parameter type 'color'
Parameter is a color

Valid values are:

* "icon0"
* "icon1"
* any known named html color (e.g. "red", "green", "saddlebrown", "tomato", ...)
* any 3 or 6 digit hexadecimal color value prefixed by "#" (e.g. "#f00", "#0f0", "#8b4513", "#ff6347", ...)

**Additional settings:**  

* None

##Parameter type 'item'
Parameter indicates an item.  
In the future there may be the possibility to validate items.  
Currently the same checks as for type "text" are being performed.

**Additional settings:**  

* None

##Parameter type 'iconseries'
Parameter defines an iconseries.  
Valid values:

* Any known dynamic icon of SmartVISU
* Set of 10 icons in SmartVisu icon directory.  
As parameter "\[filename\]_00.svg" needs to be given.  
Files "\[filename\]_10.svg", "\[filename\]_20.svg", "\[filename\]_30.svg", ...,  "\[filename\]_90.svg" and "\[filename\]_100.svg" are being used.  
Their existence is checked by the template checker

**Additional settings:**  

* None

##Parameter type 'type'
Parameter is an button type.  
Valid values are

* micro
* mini
* midi

**Additional settings:**  

* None

##Parameter type 'duration'
Parameter requires [duration format](http://docu.smartvisu.de/2.7/index.php?page=misc/fundamentals) .

**Additional settings:**  

* None