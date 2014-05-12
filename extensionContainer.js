module.exports = function extensionContainer() {
	var extensions = {};

	var add = function add(extension) {
		var extensionAlreadyExists = extensions.hasOwnProperty(extension.id);
		if (extensionAlreadyExists) {
			throw '1: Extension "' + extension.id + '" already exists.';
		}

		extension.loaded = false;
		extensions[extension.id] = extension;

		return api;
	};

	var get = function get(id) {
		var extensionNotFound = !extensions.hasOwnProperty(id);
		if (extensionNotFound) {
			throw '2: Extension "' + id + '" not found.';
		}

		return extensions[id];
	};

	var exists = function exists(id) {
		return extensions.hasOwnProperty(id);
	};

	var api = {
		add: add,
		get: get,
		all: extensions,
		exists: exists
	};
	return api;
};