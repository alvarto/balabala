const dateFormat = require('dateformat'),
    cheerio = require('cheerio'),
	simplify = require('../utils/simplifier'),
    fetch = require('../utils/fetcher'),
    decoder = require('../utils/decoder'),
    reader = require('../utils/reader');
 
module.exports = function () {
    var url = this.query.url,
        that = this;

    if (!REG_URL.test(url)) {
        return Promise.reject(new Error("Not a valid url"))
    }
   
    return fetch(url)
		.then(decoder)
		.then(reader)
		.then(simplify(url))
        .then(function (result) {
            that.render('article', {
                title: result.title,
                imgs: result.imgs,
                content: result.str,
                date: dateFormat(new Date(), "yyyy-mm-dd"),
            });
        });
};