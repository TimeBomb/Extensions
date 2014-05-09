module.exports = {
	id: 'test',
	depends: ['test2'],
	api: {
		works: function() {
			console.log('You made it work! Here is a cat:\nOk no cat, but yay.');
		}
	}
};