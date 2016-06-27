(function () {
	var iframe = document.getElementById("iframe");
	var clip = new ZeroClipboard(document.getElementById("copy_container"), {
		moviePath: "js/zc.swf"
	});

	iframe.addEventListener("load", function () {
		var doc = iframe.contentDocument;
		if (doc) {
			var newheight = doc.body.scrollHeight;
			iframe.style.height = (newheight + 100) + "px";

			clip.off('dataRequested');
			clip.on('dataRequested', function (client, args) {
				var html = document.getElementById("iframe").contentDocument.documentElement.outerHTML;
				html = html.replace(/contenteditable(=\"\")?/g, "");
				client.setText(html);
			});

			var title = doc.getElementsByTagName("title");
			title = title && title[0];
			if (title) {
				doc.addEventListener("keyup", function (evt) {
					if (evt.target && /h1/i.test(evt.target.tagName)) {
						title.textContent = evt.target.textContent;
					}
				});
			}
		}
	});

	$("#btn_seeall").on("click", function () {
		$(this).parent().html("您正在查看<b>全部抓取结果</b>。<a href='javascript:location.reload();'>点此返回正文抓取结果</a>");
		iframe.src = iframe.src.replace(/digest/, "digestall");
	});

	var $hint = $("#special-alt");
	clip.addEventListener("complete", function (b, c) {
		$hint.addClass("special-alt-active");
	});
	$hint.on("animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd", function () {
		$hint.removeClass("special-alt-active");
	});
})();
