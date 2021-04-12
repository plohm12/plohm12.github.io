import Handlebars from 'handlebars';
import { mapDirFiles, readLocal } from './local-data.js';

const addPartialFiles = async () => {
  const mapper = partialFiles => partialFiles
    .filter(f => f.endsWith('.hbs'))
    .map(async f => Handlebars.registerPartial(f.slice(0, -4), await readLocal(`./src/partials/${f}`)));
  await mapDirFiles('./src/partials', mapper);
};

export default addPartialFiles;
