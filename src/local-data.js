const { readdir, readFile, rm, writeFile } = require('fs/promises');

const readLocal = async (fileName) => readFile(fileName, 'utf-8');

const readTemplate = async (templateName) => readLocal(`./src/templates/${templateName}.hbs`);

const readData = async (fileName) => {
  const data = JSON.parse(await readLocal(`./data/${fileName}`));
  data.file = fileName;
  return data;
};

const mapDirFiles = async (dirPath, mapFileNamesToAsync) => {
  const dirFileNames = await readdir(dirPath);
  return await Promise.all(mapFileNamesToAsync(dirFileNames));
};

const readLocalBatches = async () => {
  const fileNameMapper = fileNames => fileNames
    .filter(f => f.endsWith('.json') && f !== '_all.json')
    .map(f => readData(f));
  return await mapDirFiles('./data', fileNameMapper);
};

const writeLocalFile = async (contents, name) => {
  return writeFile(`./data/${name}.json`, JSON.stringify(contents, null, 2), 'utf-8');
};

const writeLocalBatch = async (batch) => {
  let name = `${getValue(batch, 'code')}-${getValue(batch, 'name')}`;
  name = name.replace(/\s+/g, '-'); // replace whitespace with dashes
  name = name.replace(/[^a-z0-9-]/gi, ''); // remove non-alphanumerics
  name = name.toLowerCase();

  if (batch.file && batch.file !== `${name}.json`)
  {
    await rm(`./data/${batch.file}`);
  }

  delete batch.file;
  return writeLocalFile(batch, name);
};

const getValue = (batch, key) =>
  batch === undefined ? undefined
  : batch.overrides && batch.overrides[key] !== undefined ? batch.overrides[key]
  : batch[key];

module.exports = {
  readLocal,
  readTemplate,
  readData,
  mapDirFiles,
  readLocalBatches,
  writeLocalFile,
  writeLocalBatch
};
