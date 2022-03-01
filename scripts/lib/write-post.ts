import { parse, stringify } from '../deps.ts';

interface IFrontMatter extends Record<string,unknown> {
  title: string,
  date: Date,
  draft: boolean,
  batch?: IBatch,
  recipe?: IRecipe
}

export interface IBatch {
  id: number,
  externalId?: number,
  name: string,
  style: string,
  status: 'ferment'|'conditioning'|'ready'|'archive',
  brewed: Date,
  bottled?: Date,
  abv?: number,
  ibu?: number,
}

interface IRecipe {
  externalId?: number,
}

function toFrontMatter(batch: IBatch) {
  const {
    name,
    brewed,
    ...frontMatterRaw
  } = batch;
  const fmu = frontMatterRaw as unknown;
  const frontMatter = fmu as IFrontMatter;
  frontMatter.title = name;
  frontMatter.date = brewed;
  return frontMatter;
}

const yamlSortedKeys = [
  // front matter keys
  'title',
  'date',
  'draft',
  'batch',
  'recipe',
  // batch keys
  'id',
  'externalId',
  'name',
  'style',
  'status',
  'brewed',
  'bottled',
  'abv',
  'ibu',
  // recipe keys
].reduce((o, e, i) => ({ ...o, [e]: i }), {} as Record<string,number>);

function sortKeys(a: string, b: string) {
  return yamlSortedKeys[a] - yamlSortedKeys[b];
}

function writeFrontMatter(frontMatter: IFrontMatter) {
  return stringify(frontMatter, { sortKeys }).trimEnd();
}

async function tryReadFile(filePath: string) {
  try {
    return await Deno.readTextFile(filePath);
  }
  catch {
    return null;
  }
}

export default async function writePost(dirName: string, fileName: string, batch: IBatch&{_file_?:string}) {
  const promises = [];

  const existingFile = (batch._file_ || '').replace('.yml', '.md');
  delete batch._file_;
  let content = !!existingFile && await tryReadFile(dirName + existingFile);
  if (content) {
    // split out content from yaml
    const lines = content.split(/\r?\n/);
    const frontMatterStart = lines.indexOf('---');
    const frontMatterEnd = lines.indexOf('---', frontMatterStart + 1);
    const preYaml = lines.slice(0, frontMatterStart);
    const frontMatterRaw = lines.slice(frontMatterStart + 1, frontMatterEnd).join('\n');
    const postYaml = lines.slice(frontMatterEnd + 1);
    // parse yaml & merge batch
    const frontMatter = {
      ...parse(frontMatterRaw) as IFrontMatter,
      ...toFrontMatter(batch)
    };

    delete frontMatter.batch;
    delete frontMatter.recipe;

    // merge yaml into content
    content = [
      '---',
      writeFrontMatter(frontMatter),
      '---',
      postYaml.join('\n')
    ].join('\n');
    if (preYaml.length > 1 || !!preYaml[0]) {
      content = preYaml.join('\n') + '\n' + content;
    }
    // delete old file
    if (existingFile !== fileName) {
      promises.push(Deno.remove(dirName + existingFile));
    }
  }
  else {
    const frontMatter = toFrontMatter(batch);
    content = [
      '---',
      writeFrontMatter(frontMatter),
      '---',
      ''
    ].join('\n');
  }

  promises.push(Deno.writeTextFile(dirName + fileName, content));
  return Promise.all(promises);
}
