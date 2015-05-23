var chainLoad = {
	load: function(items, idx) {
		if (!idx) {
			idx = 0;
		}
		if (items[idx]) {
			chainLoad._loadScript(items[idx], function() {
				chainLoad.load(items, idx + 1);
			});
		}

	},

	_loadScript: function(url, callback) {
		var script = document.createElement('script'),
			head = document.getElementsByTagName('head')[0];
		script.type = "text/javascript";
		script.src = url;
		head.appendChild(script);
		if (callback) {
			/*script.onreadystatechange = function() {
				if (this.readyState === 'loaded') {
					callback();
				}
			}*/
			script.onload = callback;
		}
	}
}

chainLoad.load([
	"http://libs.useso.com/js/jquery/2.0.2/jquery.min.js",
	"http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js",
	"http://localhost:3000/javascripts/dataModel.js",
	"http://localhost:3000/javascripts/controller.js",
	"http://localhost:3000/javascripts/page.js",
]);