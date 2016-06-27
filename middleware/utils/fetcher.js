const http = require('http'),
	https = require('https'),
	iconv = require('iconv-lite'),
	cheerio = require('cheerio');

module.exports = function (url) {
	return new Promise(function (resolve, reject) {
		var protocal;
		if(/^https/.test(url)) {
			protocal = https;
		} else if(/^http/.test(url)) {
			protocal = http;
		} else {
			reject(new Error("Fetch: Unsupported protocal: " + url));
			return;
		}
		
		protocal.get(url, function (res) {
			var chunks = [];
			res.on('data', function (chunk) {
				chunks.push(chunk);
			});
			res.on('end', function () {
				resolve({
					allChunks: Buffer.concat(chunks),
					contentType: res.headers["content-type"]
				});
			});
		}).on('error', function () {
			reject(new Error("Fetch: Failed"));
		});
	});
};