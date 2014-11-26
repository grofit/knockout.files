(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"));
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko);
    }
}
(function (ko) {	
	ko.bindingHandlers.files = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
			var allBindings = allBindingsAccessor();
			var loadedCallback, progressCallback, errorCallback, hoverClass, allowDrop, fileFilter, readAs, maxFileSize;
			var filesBinding = allBindings.files;
			
			if (typeof(ko.unwrap(filesBinding)) == "function")
			{ loadedCallback = ko.unwrap(filesBinding); }
			else
			{ 
				loadedCallback = ko.unwrap(filesBinding.onLoaded); 
				progressCallback = ko.unwrap(filesBinding.onProgress);
				errorCallback = ko.unwrap(filesBinding.onError);
				allowDrop = ko.unwrap(filesBinding.allowDrop);
				hoverClass = ko.unwrap(filesBinding.hoverClass);
				fileFilter = ko.unwrap(filesBinding.fileFilter);
				maxFileSize = ko.unwrap(filesBinding.maxFileSize);
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

			var handleFileDrag = function(fileDragEvent) {
				fileDragEvent.stopPropagation();
				fileDragEvent.preventDefault();
				
				if(fileDragEvent.type == "dragover")
				{ fileDragEvent.target.classList.add(hoverClass); }
				else
				{ fileDragEvent.target.classList.remove(hoverClass); }
			};
			
			var handleDrop = function(fileDropEvent) {
				handleFileDrag(fileDropEvent);
				handleFileSelected(fileDropEvent);
			}
			
			var handleFileSelected = function(fileSelectionEvent) {
				var files = fileSelectionEvent.target.files || fileSelectionEvent.dataTransfer.files;
				for (var i = 0, f; f = files[i]; i++) { 
					if (typeof(fileFilter) != "undefined" && !f.type.match(fileFilter)) 
					{
						if(typeof(errorCallback) == "function")
						{ errorCallback(f, "File type does not match filter"); }				
						continue; 
					}
					
					if(typeof(maxFileSize) != "undefined" && f.size >= maxFileSize)
					{ 
						if(typeof(errorCallback) == "function")
						{ errorCallback(f, "File exceeds file size limit"); }
						continue; 
					}

					readFile(f);
				}
			};

			element.addEventListener('change', handleFileSelected, false);

			if(allowDrop) {
				element.addEventListener('dragover', handleFileDrag, false);
				element.addEventListener('dragleave', handleFileDrag, false);
				element.addEventListener('drop', handleDrop, false);
			}
		}
	};
}));