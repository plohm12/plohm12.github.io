import fetch from 'node-fetch';

const BASE = 'https://api.brewersfriend.com/v1';
const API_KEY = '3170d83779ff6cc07ea3aaf14e2c3bbe02e8735e';

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

export const getBrewSessions = async () => bfFetch('brewsessions');

export const getBrewSessionDetails = async (sessionId) => bfFetch(`brewsessions/${sessionId}`);

const logsErrorHandler = () => Promise.resolve({logs: []});

export const getBrewSessionLogs = async (sessionId) => bfFetch(`brewsessions/${sessionId}/logs`, logsErrorHandler);
