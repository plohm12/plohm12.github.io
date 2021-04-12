export const getValue = (batch, key) =>
  batch === undefined ? undefined
  : batch.overrides && batch.overrides[key] !== undefined ? batch.overrides[key]
  : batch[key];
  