module.exports = function extensionFactory() {
	var Extension = function Extension() {
		return {
			id: '',
			depends: [],
			settings: {},
			data: {},
			api: {}
		};
	};

	var create = function create() {
		var newExtension = Extension();
		return newExtension;
	};

	var api = {
		create: create
	};
	return api;
};