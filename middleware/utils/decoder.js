const iconv = require('iconv-lite'),
	cheerio = require('cheerio');

module.exports = function (input) {
	return new Promise(function (resolve, reject) {
		var encoding = getCharset(input.contentType),
			allChunks = input.allChunks;

		var source,
			$,
			documentCharset;

		// 3 ways of getting encoding:
		// 1) http response header: content type
		// 2) BOM
		// 3) document: meta charset
		// this service only accepts 1 & 3
		if (encoding) {
			// if encoding is present in http header
			source = iconv.decode(allChunks, encoding);
		} else {
			// if encoding isn't present in http header
			source = iconv.decode(allChunks, "utf-8");
			// use dom traverser to find the charset
			$ = cheerio.load(source);
			$("meta").each(function (i, elem) {
				var $this = $(this);
				if ($this.attr("charset")) {
					documentCharset = documentCharset || $this.attr("charset");
				} else if ($this.attr("http-equiv") && $this.attr("content")) {
					documentCharset = documentCharset || getCharset(
						$this.attr("content")
					);
				}
			});
			if (documentCharset) {
				source = iconv.decode(allChunks, documentCharset);
			}
		}

		var result = {
			html: source
		};

		$ = cheerio.load(source);
		result.title = $("title").text();

		resolve(result);
	});
};

function getCharset(str) {
	if (str) {
		var encodingMatches = str.match(/charset=(\S+)/);
		return encodingMatches && encodingMatches[1];
	}
}