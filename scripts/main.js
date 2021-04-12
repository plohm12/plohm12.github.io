const tasks = [
  'clean',
  'copy-static',
  'import',
  'build',
];

const getLogger = (name) => (value) => console.log(`${new Date().getTime()} [${name}] ${value}`);

const runTask = async (name) => {
  const log = getLogger(name);
  log('running...');
  try {
    await import(`./${name}.js`);
    log('done');
    return false;
  }
  catch (e) {
    log('errored');
    log(typeof e === 'string' ? e : JSON.stringify(e));
    return true;
  }
};

const mainLog = getLogger('main');
mainLog('begin');
await tasks.reduce(async (prev, name) => {
  const isErrored = await prev;
  if (isErrored) {
    mainLog(`skipping ${name}`);
    return isErrored;
  }
  return await runTask(name);
}, Promise.resolve(false));
mainLog('end');
