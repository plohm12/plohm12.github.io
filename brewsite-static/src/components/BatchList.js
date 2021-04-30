import React from 'react';
import BatchItem from './BatchItem';

const BatchList = ({ header, items, notBottled = false }) => {
  return (
    <>
      <h3>{header}</h3>
      <div className="pure-g">
        {notBottled
          ? <div className="pure-u-1 list-heading">
              <div className="pure-u-2-3">
                <div className="pure-u-1 pure-u-md-2-3"><span>Name</span></div>
                <div className="pure-u-1 pure-u-md-1-3"><span>Style</span></div>
              </div>
              <div className="pure-u-1-3">
                <div><span>Brew Date</span></div>
              </div>
            </div>
          : <div className="pure-u-1 list-heading">
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
            </div>}
        {items && items.map(e => <BatchItem key={e.code} {...e} notBottled={notBottled} />)}
      </div>
    </>
  );
};

export default BatchList;
