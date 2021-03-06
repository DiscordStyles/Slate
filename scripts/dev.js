// Used to build scss files to the BetterDiscord themes folder.

const chokidar = require('chokidar');
const sass = require('sass');
const fs = require('fs');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

const dataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");
const themesFolder = dataFolder + '\\BetterDiscord\\themes';

const watcher = chokidar.watch('src', {persistent: true});
watcher.on('change', () => {
	sass.render({
		file: 'src/Slate.theme.scss',
		outputStyle: 'expanded'
	}, (err, result) => {
		const newRes = Buffer.from(result.css).toString();

		postcss([autoprefixer])
			.process(newRes, {
				from: undefined,
				to: undefined
			})
			.then(postcssRes => {
				fs.writeFile(themesFolder+'\\Slate.theme.css', postcssRes.css, (err) => {
					if (err) console.log(err);
					else console.log('Built css file.');
				})
			})
	})
});
console.log('Watching for changes...');