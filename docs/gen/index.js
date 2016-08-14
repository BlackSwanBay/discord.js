let fs;
/* eslint no-console:0 no-return-assign:0 */
let parse;

const customDocs = require('../custom/index');

const GEN_VERSION = 1;

try {
  fs = require('fs-extra');
  parse = require('jsdoc-parse');
} catch (e) {
  console.log('Error loading fs-extra or jsdoc-parse:');
  console.log(e);
  process.exit();
}

console.log('Starting...');

let json = '';

const stream = parse({
  src: ['./src/*.js', './src/*/*.js'],
});

const cwd = (`${process.cwd()}\\`).replace(/\\/g, '/');

function cleanPaths() {
  for (const item of json) {
    if (item.meta && item.meta.path) {
      item.meta.path = item.meta.path.replace(/\\/g, '/').replace(cwd, '');
    }
  }
}

function next() {
  json = JSON.parse(json);
  cleanPaths();
  console.log('parsed inline code');
  json = {
    custom: customDocs,
    json,
  };
  fs.writeFile('./docs/docs.json', JSON.stringify(json, null, 0), err => {
    if (err) {
      throw err;
    }
    console.log('done');
  });
}

stream.on('data', chunk => json += chunk.toString('utf-8'));
stream.on('end', () => next());