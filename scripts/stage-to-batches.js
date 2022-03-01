// import { readdir, readFile, writeFile } from 'fs/promises';
// import yaml from 'js-yaml';
// import Batch from './lib/batch.js';

// const stageDir = './data/stage/';
// const outDir = './data/batches/';

// // Load local data files
// let fileNames = await readdir(stageDir);
// let fileContents = await Promise.all(fileNames.map(fileName => readFile(stageDir + fileName)));
// let batches = fileContents.map(c => new Batch(yaml.load(c)));

// // Write local files
// const sortOrder = [
//   'id',
//   'externalId',
//   'draft',
//   'name',
//   'style',
//   'status',
//   'brewed',
//   'bottled',
//   'abv',
//   'ibu',
//   'recipeId',
//   'capCode',
// ].reduce((o, e, i) => ({ ...o, [e]: i*2, [`${e}!`]: i*2 + 1 }), {});

// const sortKeys = (a, b) => sortOrder[a] - sortOrder[b];

// let writeProcesses = batches.map(async batch => {
//   let fileName = `${batch.read('id')}-${batch.read('name')}`
//     .replace(/\s+/g, '-') // replace whitespace with dashes
//     .replace(/[^a-z0-9-]/gi, '') // remove non-alphanumerics
//     .split('-').filter(e => e.length).join('-') // remove multiple dashes e.g. '---'
//     .toLowerCase();
//   let outContent = yaml.dump(batch.simplify(), { sortKeys });
//   return writeFile(`${outDir}${fileName}.yml`, outContent);
// });

// await Promise.all(writeProcesses);
// console.log('success!');
