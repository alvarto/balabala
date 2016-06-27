const moment = require("moment");

module.exports = function () {
	Object.defineProperty(global, "REG_URL", {
		get: function () {
			return /(?:https?:\/\/|www\.|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|\([^\s()<>]+\))*\))+(?:\((?:[^\s()<>]+|\([^\s()<>]+\))*\)|[^\s`!()\[\]{};:'".,<>?？«»“”‘’）】。，])/;
		}
	});

	global.log = function (msg) {
		console.log(`[${getTime()}] ` + msg);
	};

	global.err = function (msg) {
		console.error(`[${getTime()}] ` + msg);
	};
};

function getTime() {
	return moment().format("YY-MM-DD HH:mm:ss");
}