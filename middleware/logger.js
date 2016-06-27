const moment = require('moment'),
	sprintf = require('util').format;

module.exports = function* (next) {
	var start = new Date;

	yield next;

	var ms = new Date - start;
	if (ms > 1000) {
		ms = ms / 1000 + "s";
	} else {
		ms = ms + "ms";
	}

	var length = this.length ? this.length.toString() : '-';

	global.log(sprintf(
		'%s %s %s %s %s %s',
		this.method,
		this.status || 404,
		this.ip,
		ms,
		formatBytes(length),
		this.url
	));
};

function formatBytes(bytes) {
	if (bytes == 0) return '0';
	var k = 1000; // or 1024 for binary
	var sizes = ['b', 'Kb', 'Mb', 'Gb', 'Tb'];
	var i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
}