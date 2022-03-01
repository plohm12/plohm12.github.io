import { readdir, readFile, writeFile } from 'fs/promises';
import yaml from 'js-yaml';
let files = await readdir('./data/batches');
let promises = files.map(async f => {
  let content = await readFile('./data/batches/' + f, 'utf8'); 
  content = yaml.load(content);
  let newFileName = f.replace('.yml', '.md');
  content = yaml.dump({batch: content}).trimEnd();
  let newContent = `---
${content}
---
`;
  await writeFile('./content/posts/' + newFileName, newContent);
});
await Promise.all(promises);