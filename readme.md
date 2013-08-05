# Knockout.Files

A simple binding for knockout 2.* to allow you to load files into the browser, using the HTML5 FileReader functionality.

## Installing

Add knockout-2.*.js to your project, then knockout.files.js to your project..

## Example

A simple example of allowing a user to load a file and then callback with the (file, data) arguments:
```
<input type="file" id="some-file-element" data-bind="files: SomeFileLoadedCallback" /> 
<script>
	var SomeFileLoadedCallback = function(file, data) {
		// Do something with file and data
	}
</script>
```

A more complicated example with custom settings:
```
<input id="some-files-element" data-bind="files: { onLoaded: SomeLoadedCallback, onProgress: SomeProgressCallback, OnError: SomeErrorCallback, fileFilter: 'image.*', readAs: 'binary' }" />
```

As shown above you can hook into any of the file loading events and get access to the data to display things like progress bars, and custom file filters, which although the accepts attribute should enforce this for you but does not currently work in all browsers. So in this case you can constrain loaded files and just ignore ones that dont match the pattern. Finally it is loading the data as a binary string in the above example, however this can be converted to use other supported types.

The available options for this binding are:

* **onLoaded** - The main callback for when the file has been loaded, returns file object and file data
* **onProgress** - The progress callback which is fired at intervals while loading, returns file object, amountLoaded and totalAmount
* **onError** - The callback for when things didnt go how you expected...
* **fileFilter** - The regex pattern to match the mime types against, e.g (image.*, application.*|text.*)
* **readAs** - to indicate how you want to read the file, options are (text, image, binary, array), the default behaviour is image

The only required argument is the loaded callback, which can be defined as a root argument:

```
<input data-bind="files: callback"/>
or
<input data-bind="files: {onLoaded: callback}"/>
```
Here is an example of what it does and how to use it, but BYOF (Bring Your Own Files).
[View Example](https://rawgithub.com/grofit/knockout.files/master/example.html)