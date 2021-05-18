const { getBrewSessions, getBrewSessionDetails, getBrewSessionLogs } = require('../src/brewers-friend.js');
const { readLocalBatches, writeLocalBatch, writeLocalFile } = require('../src/local-data.js');

let batchResponse;
let localBatches;
let existingBatches;
let sessions;
let responses;
let batches;

getBrewSessions()
  .then(response => {
    batchResponse = response;
    console.log(`${batchResponse.count} brew sessions`);
    return readLocalBatches();
  })
  .then(response => {
    localBatches = response;
    existingBatches = localBatches.reduce((o, batch) => {
      if (batch.id) {
        o[batch.id] = batch;
      }
      return o;
    }, {});

    sessions = batchResponse.brewsessions.filter(session => !existingBatches[session.id] || !existingBatches[session.id].skip);

    const requests = sessions.flatMap(session => {
      const detailRequest = getBrewSessionDetails(session.id);
      const logRequest = getBrewSessionLogs(session.id);
      return [detailRequest, logRequest];
    });

    return Promise.all(requests);
  })
  .then(response => {
    responses = response;
    batches = sessions.map((session, i) => {
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

    return Promise.all(batches.map(writeLocalBatch));
  })
  // Combine json into single array file
  .then(() => writeLocalFile([...batches, ...localBatches.filter(b => !b.id && !b.skip)], '_all'))
  .then(() => console.log('success!'));
