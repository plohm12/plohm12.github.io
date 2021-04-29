import fetch from 'node-fetch';
import { BrewersFriendApiKey } from '../settings.json';

const BASE = 'https://api.brewersfriend.com/v1';
const API_KEY = BrewersFriendApiKey;

const bfFetch = async (endpoint, errorHandler) => {
  const response = await fetch(`${BASE}/${endpoint}`, {
    headers: {
      'X-API-KEY': API_KEY
    }
  });

  if (!response.ok) {
    console.log(`${response.status} ${response.statusText} - ${endpoint}`);
    if (errorHandler) {
      return await errorHandler(response);
    }
    else {
      const rawText = await response.text();
      console.log(rawText);
      throw rawText;
    }
  }

  return await response.json();
};

const getBrewSessions = async () => bfFetch('brewsessions');

const getBrewSessionDetails = async (sessionId) => bfFetch(`brewsessions/${sessionId}`);

const logsErrorHandler = () => Promise.resolve({logs: []});

const getBrewSessionLogs = async (sessionId) => bfFetch(`brewsessions/${sessionId}/logs`, logsErrorHandler);

export const getBatchData = async () => {
  const batchResponse = await getBrewSessions();
  console.log(`${batchResponse.count} brew sessions`);
  
  // const existingBatches = await readLocalBatches()
  //   .then(batches => batches.reduce((o, batch) => {
  //     if (batch.id) {
  //       o[batch.id] = batch;
  //     }
  //     return o;
  //   }, {}));
  const existingBatches = {};
  
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

  return batches;
};
