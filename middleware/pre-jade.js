module.exports = function* (next) {
	this.set('X-Frame-Options', 'DENY');
	yield next;
};