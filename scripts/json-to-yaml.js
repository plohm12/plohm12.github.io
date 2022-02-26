import yaml from 'js-yaml';
import fs from 'fs';
import { phaseToStatus } from './lib/phase-status.js';
import Batch from './lib/batch.js';

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
].reduce((o, e, i) => ({ ...o, [e]: i }), {});

const sortKeys = (a, b) => sortOrder[a] - sortOrder[b];

fs.readdirSync('./data/old')
.filter(f => f.endsWith('.json') && f !== '_all.json')
.map(fileName => [fileName, JSON.parse(fs.readFileSync('./data/old/' + fileName, 'utf8'))])
.map(([fileName, original]) => {
  let data = {...original};
  Object.entries(data.overrides || {}).map(e => {
      data[`${e[0]}!`] = e[1];
      delete data[e[0]];
  });
  delete data.overrides;
  data = new Batch(data);
  delete data.recipeId;
  if (data.read('id'))
    data.assign('externalId', +data.read('id'));
  data.assign('id', +(/\d+/.exec(data.read('code'))[0]));
  delete data.code;
  if (data.read('abv'))
    data.assign('abv', Math.round(data.read('abv') * 10) / 10);
  if (data.read('ibu'))
    data.assign('ibu', Math.round(data.read('ibu')));
  delete data.skip;
  data.assign('draft', data.isPublic != null && !data.isPublic);
  delete data.isPublic;
  data.assign('status', phaseToStatus(data.phase));
  delete data.phase;

  let output = yaml.dump(data, { sortKeys });
  let nameTemp = fileName.split('-').filter(value => value.length).map(value => value.toLowerCase());
  nameTemp[0] = +nameTemp[0];
  let newFileName = nameTemp.join('-').replace('.json', '.yml');
  fs.writeFileSync('./data/batches/' + newFileName, output, 'utf8');
});
