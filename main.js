module.exports = function extensions() {
	var fullPath = require('path').resolve;
	var container = require(fullPath('extensionContainer.js'))();
	var loader = require(fullPath('extensionLoader.js'))(container);
	var autoloader = require(fullPath('extensionAutoloader.js'))(loader);
	// TODO: Watchjs doesn't seem to work; figure it out and replace if necessary
	var watch = require('watchjs').watch;

	var attachSaveHandler = function attachSaveHandler(object, saveHandler) {
		var alsoWatchNewProperties = true;
		watch(object, function(property, action, difference, oldValue) {
			console.log('test');
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
		loadFolder: autoloader.loadFolder,
		setApi: loader.setApi,
		setSettings: loader.setSettings,
		setData: loader.setData,
		setSettingsSaveHandler: setSettingsSaveHandler,
		setDataSaveHandler: setDataSaveHandler,
	};
	return api;
}();