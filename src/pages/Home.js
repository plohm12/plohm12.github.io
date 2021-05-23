import React from 'react';
import { useRouteData } from 'react-static';

import PageContainer from './PageContainer';
import BatchList from '../components/BatchList';

const Home = () => {
  const { drinking, conditioning, fermenting, archive } = useRouteData();
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
