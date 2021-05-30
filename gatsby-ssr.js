import React from 'react';

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  setHtmlAttributes({
    lang: 'en-US'
  });
  setHeadComponents([
    <link key="pure-css" rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css" />,
    <link key="pure-css-responsive-grid" rel="stylesheet" href="https://unpkg.com/purecss@2.0.5/build/grids-responsive-min.css" />,
    // <link key="local-styles" rel="stylesheet" href="/styles.css" />
  ]);
};
