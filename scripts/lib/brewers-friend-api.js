const BASE = 'https://api.brewersfriend.com/v1';

let _apiKey = null;
const setApiKey = (apiKey) => {
  _apiKey = apiKey;
}

const bfFetch = async (endpoint, errorHandler) => {
  if (_apiKey == null) {
    throw 'You must call setApiKey before using this API';
  }

  const response = await fetch(`${BASE}/${endpoint}`, {
    headers: {
      'X-API-KEY': _apiKey
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

const getBrewSessions = async () => {
  const limit = 20;
  let offset = 0;
  let results = [];
  let total = 0;
  do {
    const response = await bfFetch(`brewsessions?offset=${offset}&limit=${limit}`);
    total = +response.count;
    results = [...results, ...response.brewsessions];
    offset += limit;
  } while (results.length < total);
  return results;
};

const getBrewSessionDetails = (sessionId) => bfFetch(`brewsessions/${sessionId}`);

const logsErrorHandler = () => Promise.resolve({logs: []});

const getBrewSessionLogs = (sessionId) => bfFetch(`brewsessions/${sessionId}/logs`, logsErrorHandler);

export {
  getBrewSessions,
  getBrewSessionDetails,
  getBrewSessionLogs,
  setApiKey
};
