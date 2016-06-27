const Jade = require("koa-jade"),
	lodash = require("lodash");

module.exports = function () {
	var jade = new Jade({
		debug: false,
		pretty: false,
		compileDebug: false,
		viewPath: './view/',
		helperPath: [{
			_: lodash,
			REG_URL: REG_URL,
		}]
	});
	return jade.middleware;
};