module.exports = function extensionAutoloader(extensionLoader) {
	var fs = require('fs');
	var mainExtensionFileName = 'main.js';

	// TODO: There is probably some path cross-platform path builder using fs. Use that everywhere rather than hardcode forward slashes - /
	var getExtensionFromFile = function getExtensionFromFile(filePath) {
		var mainExtensionFilePath = '/' + mainExtensionFileName;
		var extensionFile = filePath + mainExtensionFilePath;
		var isValidExtension = fs.existsSync(extensionFile);

		if (!isValidExtension) {
			return false;
		}
		return require(extensionFile);
	};

	// TODO: Rework to load dependencies in a different way, as this way is inefficient and can lead to infinite loops
	var loadListOfExtensions = function loadArray(extensionsList, extensionDirectory) {
		var loadLater = [];
		for (var i = 0, length = extensionsList.length; i < length; i++) {
			var extension = extensionsList[i];
			var extensionIsFolder = typeof extension === 'string';
			if (extensionIsFolder) {
				var extensionPath = extensionDirectory + '/' + extension;
				extension = getExtensionFromFile(extensionPath);
				var invalidExtensionFile = extension === false;
				if (invalidExtensionFile) {
					continue;
				}
			}

			try {
				extensionLoader.load(extension);
				// Testing badly, like humans do...
				if (extension.api && extension.api.works) {
					extension.api.works();
				}
			} catch (error) {
				loadLater.push(extension);
			}
		}

		if (loadLater.length > 0)  {
			loadListOfExtensions(loadLater);
		}
	};

	var loadAll = function loadAll(extensionDirectory) {
		if (!fs.existsSync(extensionDirectory)) {
			throw 'Unable to load all extensions in nonexistent folder "' + extensionDirectory + '".';
		}

		var extensionDirectoryFiles = fs.readdirSync(extensionDirectory);
		loadListOfExtensions(extensionDirectoryFiles, extensionDirectory);
	};
		

	var api = {
		loadAll: loadAll
	};
	return api;
};