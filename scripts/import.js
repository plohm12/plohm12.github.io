import { readdir, readFile, rm, writeFile } from 'fs/promises';
import yaml from 'js-yaml';
import { getBrewSessions, getBrewSessionDetails, getBrewSessionLogs, setApiKey } from './lib/brewers-friend-api.js';
import { phaseToStatus } from './lib/phase-status.js';
import Batch from './lib/batch.js';

const stageDir = './data/stage/';
const outDir = './data/batches/';

let settings = await readFile('./settings.json');
let { BrewersFriendApiKey } = JSON.parse(settings);

function keyBy(arr, key) {
  return arr.reduce((o, v) => ({ ...o, [v[key]]: v }), {});
}

// Load brew sessions from Brewer's Friend
setApiKey(BrewersFriendApiKey);
let extSessions = await getBrewSessions();
console.log(`${extSessions.length} brew sessions queried from Brewer's Friend API.`);

// Load local data files
let fileNames = await readdir(stageDir);
let fileContents = await Promise.all(fileNames.map(fileName => readFile(stageDir + fileName)));
let localBatches = fileContents.map((content, i) => {
  let parsed = yaml.load(content);
  parsed._file_ = fileNames[i];
  return parsed;
});
console.log(`${localBatches.length} batches read from data files.`);
let batchMap = keyBy(localBatches, 'externalId');

// Load additional brew session info from Brewer's Friend
let sessions = extSessions
  .filter(session => !batchMap[session.id] || batchMap[session.id].status !== 'archive');
console.log(`${sessions.length} new & current batches to be processed from Brewer's Friend.`);

let detailRequests = sessions.flatMap(session => {
  const detailRequest = getBrewSessionDetails(session.id);
  const logRequest = getBrewSessionLogs(session.id);
  return [detailRequest, logRequest];
});
let detailResponses = await Promise.all(detailRequests);

// Map Brewer's Friend data to local batch format
let batches = sessions.map((session, i) => {
  let batch = new Batch({
    ...(batchMap[session.id] || {}),
    id: +(/\d+/.exec(session.batchcode)[0]), // strip alphas, no leading 0s
    externalId: +session.id,
    status: phaseToStatus(session.phase),
  });

  const detail = detailResponses[i * 2].brewsessions[0];
  batch.assign('recipeId', +detail.recipeid);
  
  batch.assign('draft', !(+detail.recipe.public)); // '1' or '0'
  batch.assign('name', session.recipe_title);
  batch.assign('style', detail.recipe.stylename);

  if (detail.current_stats && detail.current_stats.abv_alt) {
    batch.assign('abv', Math.round(+detail.current_stats.abv_alt * 10) / 10);
    batch.assign('ibu', Math.round(+detail.recipe.ibutinseth));
  }

  const logs = detailResponses[i * 2 + 1].logs;
  const brewDayLog = logs.find(log => log.eventtype === 'Brew Day Complete');
  if (brewDayLog) {
    batch.assign('brewed', brewDayLog.userdate);
  }

  const packageDayLog = logs.find(log => log.eventtype === 'Packaged');
  if (packageDayLog) {
    batch.assign('bottled', packageDayLog.userdate);
  }

  return batch;
});

// Write local files
const sortOrder = [
  'id',
  'externalId',
  'draft',
  'name',
  'style',
  'status',
  'brewed',
  'bottled',
  'abv',
  'ibu',
  'recipeId',
  'capCode',
].reduce((o, e, i) => ({ ...o, [e]: i*2, [`${e}!`]: i*2 + 1 }), {});

const sortKeys = (a, b) => sortOrder[a] - sortOrder[b];

let writeProcesses = batches.flatMap(async batch => {
  let fileName = `${batch.read('id')}-${batch.read('name')}`
    .replace(/\s+/g, '-') // replace whitespace with dashes
    .replace(/[^a-z0-9-]/gi, '') // remove non-alphanumerics
    .split('-').filter(e => e.length).join('-') // remove multiple dashes e.g. '---'
    .toLowerCase();
  let operations = [];
  if (batch._file_ && batch._file_ !== `${fileName}.yml`) {
    operations = [
      rm(stageDir + batch._file_),
      rm(outDir + batch._file_)
    ];
  }
  delete batch._file_;
  let stageContent = yaml.dump(batch, { sortKeys });
  let outContent = yaml.dump(batch.simplify(), { sortKeys });
  operations = [ ...operations,
    writeFile(`${stageDir}${fileName}.yml`, stageContent),
    writeFile(`${outDir}${fileName}.yml`, outContent)
  ];
  return operations;
});

await Promise.all(writeProcesses);
console.log('success!');
