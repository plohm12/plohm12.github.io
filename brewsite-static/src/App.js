import React from 'react'
import { useRouteData, useSiteData } from 'react-static';

import { getBatchData } from './brewers-friend';

import BatchList from './components/BatchList';
import './styles.css';

const testBatch = {
  code: '123',
  name: 'Paul Test Batch',
  style: 'pale ale',
  abv: 4.5,
  ibu: 30,
  brewDate: '2021-02-01',
  bottleDate: '2021-02-20'
}

const App = () => {
  // const { batches } = useSiteData();
  const { batches } = useRouteData();
  console.log(batches);
  // const [batches, setBatches] = React.useState([]);

  // React.useEffect(() => {
  //   const action = async () => {
  //     const data = await getBatchData();
  //     setBatches(data);
  //   };
  //   action();
  // }, []);

  return (
      <div className="pure-g">
        <div className="pure-u-md-1-8"></div>
        <div className="pure-u-1 pure-u-md-3-4">
          <h1>What's Paul Brewing?</h1>
          {/* <BatchList header="Currently Fermenting" items={[testBatch]} notBottled /> */}
          <BatchList header="Currently Enjoying" items={batches} />
          <BatchList header="Almost Ready" items={batches} />
          <BatchList header="Past Brews" items={batches} />
        </div>
        <div className="pure-u-md-1-8"></div>
      </div>
  )
};

export default App;
