// GitHub action used to build scss files to the dist folder.

const compile = require('./compile');
const {name} = require('./config.json');

compile({
	target: ['src', '_base.scss'],
	output: ['dist', 'dist', `${name}.css`]
});