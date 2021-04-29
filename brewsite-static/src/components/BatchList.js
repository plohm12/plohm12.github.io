import React from 'react';
import BatchItem from './BatchItem';

const BatchList = ({ header, items, notBottled = false }) => {
  return (
    <>
      <h3>{header}</h3>
      <div className="pure-g">
        <div className="pure-u-1 list-heading">
          <div className="pure-u-1-2">
            <div className="pure-u-1 pure-u-md-2-3"><span>Name</span></div>
            <div className="pure-u-1 pure-u-md-1-3"><span>Style</span></div>
          </div>
          <div className="pure-u-1-6">
            <div className="pure-u-1 pure-u-md-1-2"><span>ABV</span></div>
            <div className="pure-u-1 pure-u-md-1-2"><span>IBU</span></div>
          </div>
          <div className="pure-u-1-3">
            <div className="pure-u-1 pure-u-md-1-2"><span>Brew Date</span></div>
            <div className="pure-u-1 pure-u-md-1-2"><span>Bottle Date</span></div>
          </div>
        </div>
        {/* <div className="pure-u-md-1-3"><p>Name</p></div>
        <div className="pure-u-md-1-6"><p>Style</p></div>
        <div className="pure-u-md-1-12"><p>ABV</p></div>
        <div className="pure-u-md-1-12"><p>IBU</p></div>
        <div className="pure-u-md-1-6"><p>Brew Date</p></div>
        <div className="pure-u-md-1-6"><p>Bottle Date</p></div> */}
        {items && items.map(e => <BatchItem key={e.code} {...e} notBottled={notBottled} />)}
      </div>
      {/* <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Style</th>
            {!notBottled &&
              <>
                <th>ABV</th>
                <th>IBU</th>
              </>}
            <th>Brew Date</th>
            {!notBottled && <th>Bottle Date</th>}
          </tr>
        </thead>
        <tbody>
          {items && items.map(e => <BatchItem key={e.code} {...e} notBottled={notBottled} />)}
        </tbody>
      </table> */}
    </>
  );
};

export default BatchList;
