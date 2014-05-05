module.exports = function extensionLoader(extensionContainer) {
	var apiContainer = {};
	var settingsContainer = {};
	var dataContainer = {};

	var setApiContainer = function setApiContainer(object) {
		apiContainer = object;

		return api;
	};

	var setSettingsContainer = function setSettingsContainer(object) {
		settingsContainer = object;

		return api;
	};

	var setDataContainer = function setDataContainer(object) {
		dataContainer = object;

		return api;
	};

	var loadApi = function loadApi(extensionId) {
		var extension = extensionContainer.get(extensionId);
		var extensionApi = extension.api;

		apiContainer.extensionId = extensionApi;

		return api;
	};

	var loadSettings = function loadData(extensionId) {
		var extension = extensionContainer.get(extensionId);
		var extensionSettings = extension.settings;

		settingsContainer.extensionId = extensionSettings;

		return api;
	};

	var loadData = function loadData(extensionId) {
		var extension = extensionContainer.get(extensionId);
		var extensionData = extension.data;

		dataContainer.extensionId = extensionData;

		return api;
	};

	var load = function load(extension) {
		var dependsOn = extension.depends;
		if (dependsOn.length > 0) {
			for (var i = 0, len = dependsOn.length; i < len; i++) {
				var dependencyId = dependsOn[i];
				var dependencyExists = extensionContainer.exists(dependencyId);
				if (!dependencyExists) {
					throw 'Unable to load "' + extension.id + '". Dependency "' + dependencyId + '" not found.';
				}

				var dependencyLoaded = extensionContainer.get(dependencyId).loaded;
				if (!dependencyLoaded) {
					throw 'Unable to load "' + extension.id + '". Dependency "' + dependencyId + '" not loaded.';
				}
			}
		}

		extensionContainer.add(extension);
		loadApi(extension.id);
		loadSettings(extension.id);
		loadData(extension.id);

		return api;
	};

	var api = {
		load: load,
		loadApi: loadApi,
		loadSettings: loadSettings,
		loadData: loadData,
		setApi: setApiContainer,
		setSettings: setSettingsContainer,
		setData: setDataContainer,
		settings: settingsContainer,
		data: dataContainer,
		api: apiContainer
	};
	return api;
};