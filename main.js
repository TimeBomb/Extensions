module.exports = function extensions() {
	var factory = require('extensionFactory.js')();
	var container = require('extensionContainer.js')();
	var loader = require('extensionLoader.js')(container);
	var autoloader = require('extensionAutolader.js')(loader);
	var watch = require('watchjs').watch;

	var attachSaveHandler = function attachSaveHandler(object, saveHandler) {
		var alsoWatchNewProperties = true;
		watch(object, function(property, action, difference, oldValue) {
			var newValue = object[property];
			saveHandler(property, newValue, oldValue);
		}, 0, alsoWatchNewProperties);
	};

	var setSettingsSaveHandler = function setSettingsSaveHandler(saveHandler) {
		attachSaveHandler(loader.settings, saveHandler);

		return api;
	}

	var setDataSaveHandler = function setSettingsSaveHandler(saveHandler) {
		attachSaveHandler(loader.data, saveHandler);

		return api;
	}

	var api = {
		create: factory.create,
		autoload: autoloader.autoload,
		setApi: loader.setApiContainer,
		setSettings: loader.setSettingsContainer,
		setData: loader.setDataContainer,
		setSettingsSaveHandler: setSettingsSaveHandler,
		setDataSaveHandler: setDataSaveHandler,
		loader: loader,
		container: container
	};
	return api;
};