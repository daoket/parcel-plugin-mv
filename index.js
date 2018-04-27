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
				return new Promise(resolve => {
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
										resolve('move success!')
									});
								});
							});
						});
					}, true);
				})
			}
			(async () => {
				const originPath = path.join(path.dirname(path.dirname(dir)), './src/static')
				const buildPath = path.join(dir, './static')
				await mv(originPath, buildPath)
			})()
		}
	})
}