const fetch = require('node-fetch');
const settings = require('../settings.json');

const BASE = 'https://api.brewersfriend.com/v1';

const bfFetch = async (endpoint, errorHandler) => {
  const response = await fetch(`${BASE}/${endpoint}`, {
    headers: {
      'X-API-KEY': settings.BrewersFriendApiKey
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

module.exports = {
  getBrewSessions,
  getBrewSessionDetails,
  getBrewSessionLogs
};
