module.exports = function extensionAutoloader(extensionLoader) {
	var fs = require('fs');
	var fullPath = require('path').resolve;
	var mainExtensionFileName = 'main.js';

	var getExtensionFromFile = function getExtensionFromFile(filePath) {
		var extensionFile = fullPath(filePath, mainExtensionFileName);
		var isValidExtension = fs.existsSync(extensionFile);
		if (!isValidExtension) {
			return false;
		}
		return require(extensionFile);
	};

	var tryLoadExtension = function tryLoadExtension(extension, loadAfter) {
		try {
			extensionLoader.load(extension);
			if (loadAfter[extension.id] && loadAfter[extension.id].length > 0) {
				for (var i = 0, length = loadAfter[extension.id].length; i < length; i++) {
					var extensionToLoad = loadAfter[extension.id].splice(i)[0];
					if (loadAfter[extension.id].length === 0) {
						delete loadAfter[extension.id];
					}
					tryLoadExtension(extensionToLoad, loadAfter);
				}
			}
		} catch (error) {
			if (!extension.depends) {
				throw '3: ' + error;
			}
			for (var i = 0, length = extension.depends.length; i < length; i++) {
				var dependencyId = extension.depends[i];
				loadAfter[dependencyId] = loadAfter[dependencyId] || [];
				loadAfter[dependencyId].push(extension);
			}
		}
	};

	var loadListOfExtensions = function loadListOfExtensions(extensionsList, extensionDirectory) {
		var loadAfter = {};
		for (var i = 0, length = extensionsList.length; i < length; i++) {
			var extension = extensionsList[i];
			var extensionIsFolder = typeof extension === 'string';
			if (extensionIsFolder) {
				var extensionPath = fullPath(extensionDirectory, extension);
				extension = getExtensionFromFile(extensionPath);
				var invalidExtensionFile = extension === false;
				if (invalidExtensionFile) {
					continue;
				}
			}

			tryLoadExtension(extension, loadAfter);
		}
		var unloadedExtensions = Object.keys(loadAfter);
		if (unloadedExtensions.length > 0) {
			throw '2: Unable to load some extensions due to the following dependencies missing: ' + unloadedExtensions;
		}
	};

	var loadFolder = function loadFolder(extensionDirectory) {
		if (!fs.existsSync(extensionDirectory)) {
			throw '1: Unable to load all extensions in nonexistent folder "' + extensionDirectory + '".';
		}

		var extensionDirectoryFiles = fs.readdirSync(extensionDirectory);
		loadListOfExtensions(extensionDirectoryFiles, extensionDirectory);
	};
		

	var api = {
		loadFolder: loadFolder
	};
	return api;
};