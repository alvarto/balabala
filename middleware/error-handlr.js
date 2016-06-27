
module.exports = function* (next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		global.err(err.stack);
		if (process.env.NODE_ENV === "test") {
			this.body = err.stack;
		} else {
			this.body = err.message;
		}
		this.app.emit('error', err, this);
	}
};