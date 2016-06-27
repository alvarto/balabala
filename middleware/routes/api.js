const dateFormat = require('dateformat'),
    cheerio = require('cheerio'),
	_ = require('lodash'),
	simplify = require('../utils/simplifier'),
    fetch = require('../utils/fetcher'),
    decoder = require('../utils/decoder'),
    reader = require('../utils/reader');

module.exports = function () {
	var data = this.request.body,
		that = this;

	if (!data.url || !data.content) {
		that.response.body = JSON.stringify({
			errno: 6677,
			message: "Balabala: empty url or empty content",
		});
		return;
	}
	var simplifier = simplify(data.url);

	return Promise.all([
		Promise.resolve({
			url: data.url,
			html: data.content
		}).then(reader).then(simplifier),
		Promise.resolve({
			url: data.url,
			html: data.content
		}).then(simplifier) 
	]).then(
		_.spread(function (main, all) {
			that.response.body = JSON.stringify({
				errno: 0,
				message: "success",
				data: {
					imgs: all.imgs,
					all: all.str,
					main: main.str,
				}
			});
		})
		).catch(function (err) {
			console.error(err.stack);
			that.response.body = JSON.stringify({
				errno: 6678,
				message: err.message,
			});
		});
};