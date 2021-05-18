import React from 'react';
import { useRouteData } from 'react-static';

import PageContainer from './PageContainer';
import BatchList from '../components/BatchList';

const Home = () => {
  const { drinking, conditioning, fermenting, archive } = useRouteData();
  return (
    <PageContainer>
      <BatchList header="Currently Enjoying" items={drinking} />
      <BatchList header="Currently Fermenting" items={fermenting} notBottled />
      <BatchList header="Almost Ready" items={conditioning} />
      <BatchList header="Past Brews" items={archive} isCollapsed />
    </PageContainer>
  )
};

export default Home;
