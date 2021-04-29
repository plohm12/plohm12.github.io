// This file is used to configure:
// - static-site generation
// - Document shell (index.html)
// - ...tons of other things!

// Get started at https://react-static.js.org

import React from 'react';

import { getBatchData } from './src/brewers-friend';

export default {
  //maxThreads: 1, // Remove this when you start doing any static generation,
  getRoutes: async () => {
    const batches = getBatchData();
    return [
      {
        path: '/',
        getData: () => ({ batches })
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
      </Head>
      <Body>{children}</Body>
    </Html>
  )
};
