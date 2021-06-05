import React from 'react';

export const onRenderBody = ({
  pathname,
  setHeadComponents,
  setHtmlAttributes,
  setPostBodyComponents,
}) => {
  setHtmlAttributes({
    lang: 'en-US'
  });
  setHeadComponents([
    <link key="pure-css" rel="stylesheet" href="https://unpkg.com/purecss@2.0.6/build/pure-min.css" />,
    <link key="pure-css-responsive-grid" rel="stylesheet" href="https://unpkg.com/purecss@2.0.5/build/grids-responsive-min.css" />,
    <script key="goat-counter-script" data-goatcounter="https://plohm12.goatcounter.com/count" async src="/goat-counter.js"></script>
  ]);
  setPostBodyComponents([
    <noscript key="goat-counter-noscript">
      <img src={`https://plohm12.goatcounter.com/count?q=noscript&p=${encodeURIComponent(pathname)}`} />
    </noscript>
  ]);
};
