const statuses = {
  'All Gone': 'archive',
  'Primary Fermentation': 'ferment',
  'Secondary Fermentation': 'ferment',
  'Conditioning': 'conditioning',
  'Ready To Drink': 'ready'
};

export function phaseToStatus(phase) {
  return statuses[phase] || null;
}
