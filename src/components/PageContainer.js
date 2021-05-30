import React from 'react';
import { Link } from 'gatsby';

import Instagram from '../assets/instagram.svg';
import Untappd from '../assets/untappd.svg';

const PageContainer = ({children}) => {
  return (
    <div className="pure-g">
      <div className="pure-u-md-1-8"></div>
      <div className="pure-u-1 pure-u-md-3-4">
        <div>
          <div className="pure-u-1">
            <h1><Link to="/">What's Paul Brewing?</Link></h1>
          </div>
          <div className="pure-u-1">
            <h4><Link to="/decoction-calc"><span>Decoction Calculator</span></Link></h4>
          </div>
        </div>
        {children}
        <div className="footer">
          <a className="instagram" href="https://instagram.com/plohm12">
            <Instagram />
          </a>
          <a className="untappd" href="https://untappd.com/user/plohm12">
            <Untappd />
          </a>
        </div>
      </div>
      <div className="pure-u-md-1-8"></div>
    </div>
  )
};

export default PageContainer;
