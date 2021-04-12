import { rm } from 'fs/promises';
import { mapDirFiles } from '../src/local-data.js';

await mapDirFiles('./bin', files => files.map(f => rm(`./bin/${f}`, { recursive: true })));
