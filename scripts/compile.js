const sass = require('sass');
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const {name} = require('./config.json');

/**
 * Compile, autoprefix and save SCSS.
 * @param {Object} options
 * @param {string[]} options.target The path of the file to be compiled. Uses `path.join()`.
 * @param {string[]} options.output The destination and name of the file. Uses `path.join()`.
 */
module.exports = (options) => {
	console.clear();
	console.log(`[${name}] Building ${options.target.join('/')} file...`);

	// Check if path exists, if not make it.
	const dirPath = options.output.filter(el => !el.includes('.')).join('/');
	if (!fs.existsSync(!dirPath)) {
		fs.mkdirSync(dirPath, {recursive: true});
	}

	sass.render({
		file: path.join(...options.target),
		outputStyle: 'expanded',
	}, (error, result) => {
		if (error) {
			console.error(error);
			return false;
		}

		const css = Buffer.from(result.css).toString();

		postcss([autoprefixer])
			.process(css, {
				from: undefined,
				to: undefined
			})
			.then(postcssRes => {
				fs.writeFile(path.join(...options.output), postcssRes.css.replace('@charset "UTF-8";\n', ""), (err) => {
					if (err) console.error(err);
					else console.log(`[${name}] Successfully built ${options.target.join('/')} file. (${(result.stats.duration/60000 * 60).toFixed(2)}s)`);
				})
			})
	})
}