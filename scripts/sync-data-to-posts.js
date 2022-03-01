import { parse } from './deps.ts';
import { simplify } from './lib/batch.ts'
import writePost from './lib/write-post.ts';

for await (const f of Deno.readDir('./data/external')) {
  let content = await Deno.readTextFile('./data/external/' + f.name);
  content = simplify(parse(content));
  content._file_ = f.name;
  await writePost('./content/posts/', f.name.replace('.yml', '.md'), content);
}
