var fullPath = require('path').resolve;
var extensions = require(fullPath('./main.js'));
var extensionData = {};
var extensionApi = {};
extensions.setApi(extensionApi);
extensions.setData(extensionData);
extensions.setDataSaveHandler(function (property, newValue, oldValue) {
	console.log('Extension Data updated. ' + property + 'changed from ' + oldValue + ' to ' + newValue);
});

extensions.loadFolder(fullPath('./exts'));
extensionApi.test.works();