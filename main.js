module.exports = function extensions() {
	var factory = require('extensionFactory.js')();
	var container = require('extensionContainer.js')();
	var loader = require('extensionLoader.js')(container);
	var autoloader = require('extensionAutolader.js')(loader);
	var watch = require('watchjs').watch;

	var attachSaveHandler = function attachSaveHandler(object, saveHandler) {
		var alsoWatchNewProperties = true;
		watch(object, function(property, action, difference, oldValue) {
			saveHandler(property, object[property], oldValue);
		}, 0, alsoWatchNewProperties);
	};

	var setSettings = function setSettings(object, saveHandler) {
		loader.setSettingsContainer(object);
		
		return api;
	};

	var setSettingsSaveHandler = function setSettingsSaveHandler(saveHandler) {
		attachSaveHandler(loader.settings, saveHandler);	
	}

	var setData = function setData(object, saveHandler) {
		loader.setDataContainer(object);

		return api;
	};

	var setDataSaveHandler = function setSettingsSaveHandler(saveHandler) {
		attachSaveHandler(loader.data, saveHandler);	
	}

	var api = {
		create: factory.create,
		autoload: autoloader.autoload,
		setApi: loader.setApiContainer,
		setSettings: setSettings,
		setData: setData,
		loader: loader,
		container: container
	};
	return api;
};