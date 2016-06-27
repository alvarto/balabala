const read = require('node-read'),
	SimpleNode = require('./class.simple-node');

module.exports = function (input) {
	if(!input || !input.html) {
		return Promise.reject(new Error("Reader: empty source received."));
	}
	
	return new Promise(function (resolve, reject) {
		read(input.html, SimpleNode.prototype.TAGS.BLACKLIST, function (err, article, res) {
            if (err) {
                reject(new Error("Reader: error analizing webpage"));
                return;
            }

			input.content = article.content;
			resolve(input);
		});
	});
};