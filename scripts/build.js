import { mkdir, writeFile } from 'fs/promises';
import Handlebars from 'handlebars';
import addHelpers from '../src/hb-helpers.js';
import addPartials from '../src/hb-partials.js';
import { readLocalBatches, readTemplate } from '../src/local-data.js';

// generate html from batch files

// load Handlebars snippets
addHelpers();
await addPartials();

// load batch data files
let allBatches = await readLocalBatches();
allBatches = allBatches.filter(b => !b.skip);
allBatches.sort((a, b) => a.code > b.code ? -1 : 1);

// generate individual batch pages
await mkdir('./bin/batch');
const batchFile = Handlebars.compile(await readTemplate('batch'));
await Promise.all(allBatches.map((batch) => {
  const batchOutput = batchFile(batch);
  return writeFile(`./bin/batch/${batch.code}.html`, batchOutput, 'utf-8');
}));

// categorize batches for homepage
let input = {
  drinking: [],
  conditioning: [],
  fermenting: [],
  archive: []
};
input = allBatches.reduce((agg, batch) => {
  if (batch.overrides) {
    batch = {
      ...batch,
      ...batch.overrides
    };
  }

  let bucket;
  switch (batch.phase) {
    case 'Primary Fermentation':
    case 'Secondary Fermentation':
      bucket = 'fermenting';
      break;
    case 'Conditioning':
      bucket = 'conditioning';
      break;
    case 'Ready To Drink':
      bucket = 'drinking';
      break;
    case 'All Gone':
      bucket = 'archive';
      break;
    default:
      return agg;
  }
  agg[bucket].push(batch);
  return agg;
}, input);

const index = Handlebars.compile(await readTemplate('index'));
const output = index(input);
await writeFile('./bin/index.html', output, 'utf-8');
