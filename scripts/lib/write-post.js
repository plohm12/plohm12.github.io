import { access, readFile, rm, writeFile } from 'fs/promises';
import yaml from 'js-yaml';

export default async function writePost(dirName, fileName, batch) {
  let promises = [];
  let content = '';

  let existingFile = (batch._file_ || '').replace('.yml', '.md');
  delete batch._file_;

  if (existingFile && (await fileExists(dirName + existingFile))) {
    content = await readFile(dirName + existingFile, 'utf8');
    // split out content from yaml
    let lines = content.split(/\r?\n/);
    let frontMatterStart = lines.indexOf('---');
    let frontMatterEnd = lines.indexOf('---', frontMatterStart + 1);
    let preYaml = lines.slice(0, frontMatterStart);
    let frontMatterRaw = lines.slice(frontMatterStart + 1, frontMatterEnd).join('\n');
    let postYaml = lines.slice(frontMatterEnd + 1);
    // parse yaml
    let frontMatter = yaml.load(frontMatterRaw);
    // merge batch into yaml
    frontMatter.batch = {
      ...(frontMatter.batch || {}),
      ...batch
    };
    delete frontMatter._file_;
    // merge yaml into content
    content = [
      '---',
      yaml.dump(frontMatter).trimEnd(),
      '---',
      postYaml.join('\n')
    ].join('\n');
    if (preYaml.length > 1 || !!preYaml[0]) {
      content = preYaml.join('\n') + '\n' + content;
    }
    // write file
    if (existingFile !== fileName) {
      promises.push(rm(dirName + existingFile));
    }
  }
  else {
    let frontMatter = yaml.dump({ batch });
    content = [
      '---',
      frontMatter.trimEnd('\n').trimEnd('\r'),
      '---',
      ''
    ].join('\n');
  }

  promises.push(writeFile(dirName + fileName, content, 'utf8'));
  return Promise.all(promises);
}

async function fileExists(filePath) {
  return access(filePath)
    .then(() => true)
    .catch(() => false);
}
