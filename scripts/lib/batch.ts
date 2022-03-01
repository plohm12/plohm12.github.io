import { IBatch } from './write-post.ts';

export type IBatchWithOverrides = IBatch & {
  [Property in keyof IBatch as `${Property}!`]?: IBatch[Property]
}

export function getName(batch: IBatchWithOverrides) {
  return batch['name!'] !== undefined ? batch['name!'] : batch.name;
}

export function simplify(batch: IBatchWithOverrides) {
  return {
    ...Object.fromEntries(Object.entries(batch).filter(e => !e[0].endsWith('!'))),
    ...Object.fromEntries(Object.entries(batch).filter(e => e[0].endsWith('!')).map(e => [e[0].replace('!', ''), e[1]])),
  } as IBatch;
}
