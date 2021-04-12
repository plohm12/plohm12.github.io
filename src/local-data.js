import { readdir, readFile, rm, writeFile } from 'fs/promises';
import { getValue } from './batch.js';

export const readLocal = async (fileName) => readFile(fileName, 'utf-8');

export const readTemplate = async (templateName) => readLocal(`./src/templates/${templateName}.hbs`);

export const readData = async (fileName) => {
  const data = JSON.parse(await readLocal(`./data/${fileName}`));
  data.file = fileName;
  return data;
};

export const mapDirFiles = async (dirPath, mapFileNamesToAsync) => {
  const dirFileNames = await readdir(dirPath);
  return await Promise.all(mapFileNamesToAsync(dirFileNames));
};

export const readLocalBatches = async () => {
  const fileNameMapper = fileNames => fileNames
    .filter(f => f.endsWith('.json'))
    .map(f => readData(f));
  return await mapDirFiles('./data', fileNameMapper);
};

export const writeLocalBatch = async (batch) => {
  let name = `${getValue(batch, 'code')}-${getValue(batch, 'name')}`;
  name = name.replace(/\s+/g, '-'); // replace whitespace with dashes
  name = name.replace(/[^a-z0-9-]/gi, ''); // remove non-alphanumerics
  name = name.toLowerCase();

  if (batch.file && batch.file !== `${name}.json`)
  {
    await rm(`./data/${batch.file}`);
  }

  delete batch.file;
  const fileName = `./data/${name}.json`;
  return writeFile(fileName, JSON.stringify(batch, null, 2), 'utf-8');
};
