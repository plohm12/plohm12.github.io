import { getBrewSessions, getBrewSessionDetails, getBrewSessionLogs } from '../src/brewers-friend.js';
import { readLocalBatches, writeLocalBatch, writeLocalFile } from '../src/local-data.js';

const batchResponse = await getBrewSessions();
console.log(`${batchResponse.count} brew sessions`);

const localBatches = await readLocalBatches();
const existingBatches = localBatches.reduce((o, batch) => {
    if (batch.id) {
      o[batch.id] = batch;
    }
    return o;
  }, {});

const sessions = batchResponse.brewsessions.filter(session => !existingBatches[session.id] || !existingBatches[session.id].skip);

const requests = sessions.flatMap(session => {
  const detailRequest = getBrewSessionDetails(session.id);
  const logRequest = getBrewSessionLogs(session.id);
  return [detailRequest, logRequest];
});

let responses = await Promise.all(requests);

const batches = sessions.map((session, i) => {
  let batch = {
    ...(existingBatches[session.id] || {}),
    id: session.id,
    code: session.batchcode,
    name: session.recipe_title,
    phase: session.phase,
    skip: false,
  };

  const detail = responses[i * 2].brewsessions[0];
  batch.recipeId = detail.recipeid;
  batch.isPublic = !!(+detail.recipe.public); // '1' or '0'

  batch.style = detail.recipe.stylename;
  if (detail.current_stats && detail.current_stats.abv_alt) {
    batch.abv = detail.current_stats.abv_alt;
    batch.ibu = +detail.recipe.ibutinseth;
  }

  const logs = responses[i * 2 + 1].logs;
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

await Promise.all(batches.map(writeLocalBatch));

// Combine json into single array file

await writeLocalFile([...batches, ...localBatches.filter(b => !b.id && !b.skip)], '_all');

console.log('success!');
