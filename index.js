var fs = require("fs");
var path = require("path");
var mkdirs = require("./lib/mkdirs");
var readfiles = require("./lib/readfiles.js");

module.exports = bundler => {

	bundler.on('bundled', async (bundle) => {
		if (process.env.NODE_ENV === 'production') {
			const dir = path.dirname(bundle.name) //...\[projectName]\target\[projectName]

			var sep = path.sep;

			function mv(spath, tpath) {
				readfiles(spath, "", true, function (files) {
					files.forEach(function (file) {
						fs.readFile(file, function (err, data) {
							if (err) {
								throw err;
							}
							file = tpath + file.replace(spath, "");
							mkdirs(path.dirname(file), function () {
								fs.writeFile(file, data, function (err) {
									if (err) {
										throw err;
									}
									// console.log('static move success!')
								});
							});
						});
					});
					console.log('static move success!')
				}, true);
			}

			var originPath = path.join(path.dirname(path.dirname(dir)), './src/static')
			const buildPath = path.join(dir, './static')

			fs.exists(originPath, (exists) => {
				if (!exists) {
					originPath = path.join(path.dirname(dir), './src/static')
					fs.exists(originPath, (exists) => {
						exists && mv(originPath, buildPath)
					})
				} else {
					mv(originPath, buildPath)
				}
			})
		}
	})
}