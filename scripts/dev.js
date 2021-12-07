// Used to build scss files to the BetterDiscord themes folder.

const chokidar = require('chokidar');
const path = require('path');
const compile = require('./compile');
const {name, dev} = require('./config.json');

const dataFolder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + "/.local/share");
let themesFolder = path.join(dataFolder, 'BetterDiscord', 'themes');

const pathFlagIndex = process.argv.findIndex(el => el === '--path');
if (pathFlagIndex !== -1) {
	themesFolder = process.argv[pathFlagIndex + 1];
}

chokidar.watch('src', {persistent: true})
	.on('ready', () => console.log(`Watching for changes...`))
	.on('change', () => {
		console.clear();

		dev.forEach(step => {
			compile({
				target: step.target,
				output: [themesFolder, ...step.output]
			})
		})
	});