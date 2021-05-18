// This file is used to configure:
// - static-site generation
// - Document shell (index.html)
// - ...tons of other things!

// Get started at https://react-static.js.org

import React from 'react';

import allBatches from './data/_all.json';

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

export default {
  //maxThreads: 1, // Remove this when you start doing any static generation,
  siteRoot: 'https://whatspaulbrewing.com',
  getRoutes: async () => {
    return [
      {
        path: '/',
        template: 'src/pages/Home',
        getData: async () => ({...batchCategories})
      // }, {
      //   path: '/about',
      //   template: 'src/pages/About'
      }
    ]
  },
  Document: ({ Html, Head, Body, children }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.5/build/base-min.css" />
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.5/build/grids-min.css" />
        <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.5/build/grids-responsive-min.css" />

        <link rel="stylesheet" href="styles.css" />
      </Head>
      <Body>{children}</Body>
    </Html>
  )
};
