import React from 'react';

const BatchItem = ({code, name, style, abv, ibu, brewDate, bottleDate, notBottled}) => {
  return (
    <div className="pure-u-1">
      <div className="pure-u-1-2">
        <div className="pure-u-1 pure-u-md-2-3"><p>{name}</p></div>
        <div className="pure-u-1 pure-u-md-1-3"><p>{style}</p></div>
      </div>
      <div className="pure-u-1-6">
        <div className="pure-u-1 pure-u-md-1-2"><p>{abv}%</p></div>
        <div className="pure-u-1 pure-u-md-1-2"><p>{ibu}</p></div>
      </div>
      <div className="pure-u-1-3">
        <div className="pure-u-1 pure-u-md-1-2"><p>{brewDate}</p></div>
        <div className="pure-u-1 pure-u-md-1-2"><p>{bottleDate}</p></div>
      </div>
    </div>
    // <tr>
    //   <td><a href={`batch/${code}.html`}>{name}</a></td>
    //   <td>{style}</td>
    //   {!notBottled &&
    //     <>
    //       <td>{abv}%</td>
    //       <td>{ibu}</td>
    //     </>}
    //   <td>{brewDate}</td>
    //   {!notBottled && <td>{bottleDate}</td>}
    // </tr>
  )
};

export default BatchItem;
