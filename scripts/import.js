import { parse, stringify } from './deps.ts';
import { getBrewSessions, getBrewSessionDetails, getBrewSessionLogs, setApiKey } from './lib/brewers-friend-api.js';
import { phaseToStatus } from './lib/phase-status.js';
import { getName, simplify } from './lib/batch.ts';
import writePost from './lib/write-post.ts';

const processAllFiles = Deno.args.length > 0 && Deno.args[0] === '--all';
if (processAllFiles) {
  // DOES NOT WORK, currently hits API throttling limit.
  // TODO: assume throttle is something like 50 req/min, test & work around.
  console.log('`--all` flag detected, processing all local files.');
}
else {
  console.log('Use option `--all` to process all local files.');
}

const stageDir = './data/external/';
const contentDir = './content/posts/';

const settings = await Deno.readTextFile('./settings.json');
const { BrewersFriendApiKey } = JSON.parse(settings);

// Load brew sessions from Brewer's Friend
setApiKey(BrewersFriendApiKey);
const extSessions = await getBrewSessions();
console.log(`${extSessions.length} brew sessions queried from Brewer's Friend API.`);

// Load local data files
const batchMap = {};
for await (const file of Deno.readDir(stageDir)) {
  const yamlContent = await Deno.readTextFile(stageDir + file.name);
  const batch = parse(yamlContent);
  batch._file_ = file.name;
  batchMap[batch.externalId] = batch;
}
console.log(`${Object.keys(batchMap).length} batches read from data files.`);

// Load additional brew session info from Brewer's Friend
const sessions = extSessions
  .filter(session => processAllFiles || !batchMap[session.id] || batchMap[session.id].status !== 'archive');
console.log(`${sessions.length} new & current batches to be processed from Brewer's Friend.`);

const detailRequests = sessions.flatMap(session => {
  const detailRequest = getBrewSessionDetails(session.id);
  const logRequest = getBrewSessionLogs(session.id);
  return [detailRequest, logRequest];
});
const detailResponses = await Promise.all(detailRequests);

// Map Brewer's Friend data to local batch format
const batches = sessions.map((session, i) => {
  const batch = {
    ...(batchMap[session.id] || {}),
    id: +(/\d+/.exec(session.batchcode)[0]), // strip alphas, no leading 0s
    externalId: +session.id,
    status: phaseToStatus(session.phase),
  };

  const detail = detailResponses[i * 2].brewsessions[0];
  batch.recipeId = +detail.recipeid;
  
  //batch.draft = !(+detail.recipe.public)); // '1' or '0'
  batch.name = session.recipe_title;
  batch.style = detail.recipe.stylename;

  if (detail.current_stats && detail.current_stats.abv_alt) {
    batch.abv = Math.round(+detail.current_stats.abv_alt * 10) / 10;
    batch.ibu = Math.round(+detail.recipe.ibutinseth);
  }

  const logs = detailResponses[i * 2 + 1].logs;
  const brewDayLog = logs.find(log => log.eventtype === 'Brew Day Complete');
  if (brewDayLog) {
    batch.brewed = brewDayLog.userdate;
  }

  const packageDayLog = logs.find(log => log.eventtype === 'Packaged');
  if (packageDayLog) {
    batch.bottled = packageDayLog.userdate;
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

const writeProcesses = batches.flatMap(batch => {
  const fileName = `${batch.id}-${getName(batch)}`
    .replace(/\s+/g, '-') // replace whitespace with dashes
    .replace(/[^a-z0-9-]/gi, '') // remove non-alphanumerics
    .split('-').filter(e => e.length).join('-') // remove multiple dashes e.g. '---'
    .toLowerCase();
  const operations = [
    writePost(contentDir, fileName + '.md', simplify(batch))
  ];
  if (batch._file_ && batch._file_ !== `${fileName}.yml`) {
    operations.push(Deno.remove(stageDir + batch._file_));
  }
  delete batch._file_;
  const stageContent = stringify(batch, { sortKeys });
  operations.push(Deno.writeTextFile(`${stageDir}${fileName}.yml`, stageContent));
  return operations;
});

await Promise.all(writeProcesses);
console.log('success!');
Deno.exit();
