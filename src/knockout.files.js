ko.bindingHandlers.files = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var allBindings = allBindingsAccessor();
		var loadedCallback, progressCallback, errorCallback, fileFilter, readAs;
		var filesBinding = allBindings.files;
		
		if (typeof(ko.unwrap(filesBinding)) == "function")
		{ loadedCallback = ko.unwrap(filesBinding); }
		else
		{ 
			loadedCallback = ko.unwrap(filesBinding.onLoaded); 
			progressCallback = ko.unwrap(filesBinding.onProgress);
			errorCallback = ko.unwrap(filesBinding.onError);
			fileFilter = ko.unwrap(filesBinding.fileFilter);
			readAs = ko.unwrap(filesBinding.readAs);
		}
		
		if(typeof(loadedCallback) != "function")
		{ return; }

		var readFile = function(file) {
			var reader = new FileReader();
			reader.onload = function(fileLoadedEvent) {
                loadedCallback(file, fileLoadedEvent.target.result);
            };
            
            if(typeof(progressCallback) == "function")
            {
	            reader.onprogress = function(fileProgressEvent) {
	            	progressCallback(file, fileProgressEvent.loaded, fileProgressEvent.total);
	            };
        	}

        	if(typeof(errorCallback) == "function")
        	{
	            reader.onerror = function(fileErrorEvent) {
	            	errorCallback(file, fileErrorEvent.target.error);
	            };
        	}

        	if(readAs == "text")
    		{ reader.readAsText(file); }
    		else if(readAs == "array")
   			{ reader.readAsArrayBuffer(file); }
   			else if(readAs == "binary")
			{ reader.readAsBinaryString(file); }
			else
   			{ reader.readAsDataURL(file); }
		};

		var handleFileChangedEvent = function(fileChangedEvent) {
			var files = fileChangedEvent.target.files;
			for (var i = 0, f; f = files[i]; i++) { 
	            if (typeof(fileFilter) != "undefined" && !f.type.match(fileFilter)) 
	          	{ continue; }

	            readFile(f);
            }
		};

		element.addEventListener('change', handleFileChangedEvent, false);
    }
};