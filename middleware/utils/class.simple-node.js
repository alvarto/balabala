// tag classification

var TAGS = {
	IGNORE: "meta,title,html,body,figure,hgroup,span,a,sub,sup,small,big,var,wbr,kbd,head,dl,dt,dd,table,tr,td,th,ol,ul,form,label,dfn,blockquote,main,article,header,s,cite,bdi,bdo,caption,colgroup,col,tbody,thead,tfoot,fieldset,frameset",
	// WONT be treated like it exist
	// WILL traverse to it children node

	BLACKLIST: "base,iframe,script,style,noscript,template,aside,canvas,slot,input,select,button,link,del,nav,svg,embed,footer,pre,textarea,source,object,param,video,audeo,track,map,area,datalist,optgroup,option,keygen,output,progress,meter,details,summary,menu,menuitem,applet",
	// WONT be treated like it exist
	// WONT traverse to it children node

	HEADER: "h1,h2,h3,h4,h5,h6",
	// WILL be preserved as original tag
	// WILL traverse to it children node

	PARAGRAPH: "p,div,section,li,br,hr",
	// WILL indicate the start of a new <p>
	// WILL traverse to it children node

	MARK: "strong,mark,em,u,s,b,i,code,font,time,address,figcaption,abbr,ruby,rt,rp,data,code,var,samp,kbd,sup,sub,ins,del,legend,marquee",
	// WILL indicate the start of a new <strong>
	// WILL traverse to it children node

	EMBED: "img,picture",
	// WONT be treated like it exist
	// WONT traverse to it children node
	
	TEXT: "text",
	// WILL be treated like it exist
	// WONT traverse to it children node
};

for (var tag in TAGS) {
	TAGS[tag] = TAGS[tag] + "," + TAGS[tag].toUpperCase();
	TAGS[tag] = TAGS[tag].split(",");
}

var TYPES = {
	TEXT: "text",
	BLACKLIST: "comment,directive,style,script",
};
for (var type in TYPES) {
	TYPES[type] = TYPES[type].split(",");
}

//////////////////////////////////////////////

// dom -> node
function SimpleNode(dom) {
	if (dom.type === "tag") {
		this.type = getTagTypeByTagName(dom.name);
		this.tag = dom.name;
	} else {
		this.type = getTypeByType(dom.type);
	}
	this.content = dom.raw;
};
SimpleNode.prototype.TAGS = TAGS;
SimpleNode.prototype.TYPES = TYPES;

//////////////////////////////////////////////

function getTagTypeByTagName(tagname) {
	for (var tag in TAGS) {
		if (TAGS[tag].indexOf(tagname) > -1) {
			return tag;
		}
	}
	return "OTHER";
}

function getTypeByType(typeName) {
	for (var type in TYPES) {
		if (TYPES[type].indexOf(typeName) > -1) {
			return type;
		}
	}
	return "OTHER";
}

module.exports = SimpleNode;