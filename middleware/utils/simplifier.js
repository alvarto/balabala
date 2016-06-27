const hParser = require('htmlparser'),
	urlParser = require('url'),
	SimpleNode = require('./class.simple-node');

// step 1: generialize all nodes to one flat array
// INPUT:  domArr <DomNode>
// OUTPUT: nodeArr <SimpleNode>
var dom2node = (function () {
	// nested dom node -> node array
	var nodeArr;
	function visit(dom) {
		var newNode = new SimpleNode(dom);

		if (newNode.type !== "OTHER" && newNode.type !== "BLACKLIST" && newNode.type !== "IGNORE") {
			if (newNode.type === "TEXT" && !String(newNode.content).trim()) {
			} else {
				nodeArr.push(newNode);
			}
		} else if (newNode.type === "OTHER") {
			global.err("Encountered an unknown tag: " + dom.name + "/" + dom.type);
		}

		if (newNode.type !== "BLACKLIST" && newNode.type !== "EMBED" && newNode.type !== "TEXT") {
			if (typeof dom.children !== "undefined") {
				dom.children.forEach(visit);
			}
		}

		newNode = null;
	}

	return function (domArr) {
		if (typeof domArr === "undefined") {
			return;
		}
		nodeArr = [];
		domArr.forEach(visit);
		return nodeArr;
	}
})();

// node array -> str
// step 2: according to the node type, concat the final string
// INPUT:  nodeArr
// OUTPUT: str , imgArr
var nodeParse = (function () {
	var str,
		lastState,
		tagStack,
		baseurl;

	function _insertStartTag(tag) {
		tagStack.push(tag);
		str += "<" + tag + ">";
	}
	function _insertEndTag() {
		if (tagStack.length > 0) {
			str += "</" + tagStack.pop() + ">";
		}
	}
	function _insertRaw(text) {
		str += text.trim();
	}

	var embedArr = [];
	function parse(node) {
		if (node.type === "TEXT") {
			if (lastState !== "start" && lastState !== "word") {
				_insertRaw(node.content);
				return;
			}
		} else if (node.type === "EMBED") {
			var match = node.content.match(/(?:src\=["'])(\S+)(?:["'])/);
			if (match && match[1]) {
				img = match[1];
				img = urlParser.resolve(baseurl, img);
				embedArr.push(img);
			}
			// _insertStartTag(node.content); // todo: comment this to hide inline imgs
			return;
		}

		if (lastState === "paragraph") {
			if (node.type === "HEADER") {
				_insertEndTag();
				_insertStartTag(node.tag);
				lastState = "header";
			} else if (node.type === "PARAGRAPH") {
				_insertEndTag();
				_insertStartTag("p");
			} else if (node.type === "MARK") {
				_insertStartTag("strong");
				lastState = "word";
			}
		} else if (lastState === "word") {
			if (node.type === "HEADER") {
				_insertEndTag();
				_insertStartTag(node.tag);
				lastState = "header";
			} else if (node.type === "PARAGRAPH") {
				_insertEndTag();
				lastState = "start";
			} else if (node.type === "MARK") {
			} else if (node.type === "TEXT") {
				_insertRaw(node.content);
				_insertEndTag();
				lastState = "paragraph";
			}
		} else if (lastState === "header") {
			if (node.type === "HEADER") {
				_insertEndTag();
				_insertStartTag(node.tag);
				lastState = "header";
			} else if (node.type === "PARAGRAPH") {
				_insertEndTag();
				_insertStartTag("p");
				lastState = "paragraph";
			} else if (node.type === "MARK") {
				_insertEndTag();
				_insertStartTag("p");
				_insertStartTag("strong");
				lastState = "word";
			}
		} else {
			while (tagStack.length > 0) {
				_insertEndTag();
			}
			if (node.type === "HEADER") {
				_insertStartTag(node.tag);
				lastState = "header";
			} else if (node.type === "PARAGRAPH") {
				_insertStartTag("p");
				lastState = "paragraph";
			} else if (node.type === "MARK") {
				_insertStartTag("p");
				_insertStartTag("strong");
				lastState = "word";
			} else if (node.type === "TEXT") {
				_insertStartTag("p");
				_insertRaw(node.content);
				lastState = "paragraph";
			}
		}
	}
	//////////////////////////////////////////////

	return function (nodeArr, url) {
		if (typeof nodeArr === "undefined") {
			return;
		}

		lastState = "start";
		tagStack = [];
		embedArr = [];
		baseurl = url;
		str = "";

		nodeArr.forEach(parse);

		while (tagStack.length > 0) {
			_insertEndTag();
		}

		str = str.replace(/<(p|h1|h2|h3|h4|h5|h6|strong)>\s*<\/\1>/g, "");

		return {
			str: str,
			imgs: embedArr
		};
	}
})();

module.exports = function (url) {
	return function(input){
		return new Promise(function (resolve, reject) {
			function callback(error, dom) {
				if (error) {
					reject("Simplfier :" + error);
					return;
				}

				var nodeArr = dom2node(dom);
				var result = nodeParse(nodeArr, url);
				input.str = result.str;
				input.imgs = result.imgs;
				resolve(input);
			}

			var handler = new hParser.DefaultHandler(callback);
			new hParser.Parser(handler).parseComplete(input.content || input.html);
		});
	};
};
