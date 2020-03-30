Any valid .html file in this folder gets imported as widget library. E.g. a macro `bar()` defined in `foo.html` can be called in your pages by `{{ foo.bar() }}`.
Widget filenames have to be valid Twig/PHP variable names. They must not contain any non-alphanumeric characters (except underlines) and must not start with a number.

In addition any .css and .js file in this folder gets loaded. The stylesheets can contain widget specific styles, the JavaScripts are meant to implement logic of the widgets and have to contain a structure like the following:

More information on how to create own widgets can be found at README.md in dropins folder.
