import { copyFile } from 'fs/promises';
import { mapDirFiles } from '../src/local-data.js';

await mapDirFiles('./static', files => files.map(f => copyFile(`./static/${f}`, `./bin/${f}`)));
