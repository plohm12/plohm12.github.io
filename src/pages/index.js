import React from 'react';

import PageContainer from '../components/PageContainer';
import BatchList from '../components/BatchList';
import allBatches from '../../data/_all.json';

// categorize batches for homepage
let batchCategories = {
  drinking: [],
  conditioning: [],
  fermenting: [],
  archive: []
};
batchCategories = allBatches.filter(batch => !batch.skip)
  .sort((a, b) => a.code > b.code ? -1 : 1)
  .reduce((agg, batch) => {
    if (batch.overrides) {
      batch = {
        ...batch,
        ...batch.overrides
      };
    }

    let bucket;
    switch (batch.phase) {
      case 'Planning':
      case 'Brewing':
      case 'Primary Fermentation':
      case 'Secondary Fermentation':
        bucket = 'fermenting';
        break;
      case 'Conditioning':
        bucket = 'conditioning';
        break;
      case 'Ready To Drink':
        bucket = 'drinking';
        break;
      case 'All Gone':
        bucket = 'archive';
        break;
      default:
        return agg;
    }
    agg[bucket].push(batch);
    return agg;
  }, batchCategories);

const Home = () => {
  const { drinking, conditioning, fermenting, archive } = batchCategories;
  return (
    <PageContainer>
      <div>
        <p>
          Did I give you a blank bottle or two?
          Find out what you've got by matching the bottle cap
          to the cap code in one of these lists.
          Brews are categorized by their current stage in the brewing process:
          Fermenting ➡ Aging ➡ Enjoying ➡ Finished.
          Each category is sorted by most recently brewed.
        </p>
        <p>
          Brews with "↗" can be clicked to view their recipe on <a href="https://brewersfriend.com" target="_blank">Brewer's Friend</a>.
        </p>
      </div>
      <BatchList header="Enjoying" items={drinking} />
      <BatchList header="Fermenting" items={fermenting} notBottled />
      <BatchList header="Aging" items={conditioning} />
      <BatchList header="Finished" items={archive} isCollapsed />
    </PageContainer>
  )
};

export default Home;
