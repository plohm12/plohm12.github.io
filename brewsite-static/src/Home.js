import React from 'react';
import { useRouteData } from 'react-static';

import BatchList from './components/BatchList';
import './styles.css';

const Home = () => {
  const { drinking, conditioning, fermenting, archive } = useRouteData();
  return (
    <div className="pure-g">
      <div className="pure-u-md-1-8"></div>
      <div className="pure-u-1 pure-u-md-3-4">
        <h1>What's Paul Brewing?</h1>
        <BatchList header="Currently Fermenting" items={fermenting} notBottled />
        <BatchList header="Currently Enjoying" items={drinking} />
        <BatchList header="Almost Ready" items={conditioning} />
        <BatchList header="Past Brews" items={archive} />
      </div>
      <div className="pure-u-md-1-8"></div>
    </div>
  )
};

export default Home;
