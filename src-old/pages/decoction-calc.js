import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';

const handleFocus = (e) => e.target.select();

const DecoctionCalc = () => {
  const [decoctionVolume, setDecoctionVolume] = useState(0);
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [targetTemperature, setTargetTemperature] = useState(0);
  const [dryWeight, setDryWeight] = useState(0);
  const [waterVolume, setWaterVolume] = useState(0);

  useEffect(() => {
    if (isNaN(currentTemperature)
      || isNaN(targetTemperature)
      || isNaN(dryWeight)
      || isNaN(waterVolume)
      || targetTemperature < currentTemperature
      || dryWeight === 0
      || currentTemperature >= 212) return;

    const mashVolume = dryWeight * ((waterVolume / dryWeight) + 0.38);
    const result = mashVolume * ((targetTemperature - currentTemperature) / (212 - currentTemperature));
    setDecoctionVolume(Math.round(result * 100) / 100);
  }, [currentTemperature, targetTemperature, dryWeight, waterVolume]);

  return (
    <PageContainer>
      <h2>Decoction Calculator</h2>
      <p>
        Use this tool to calculate how much volume of your mash
        to remove and boil to raise the temperature of your mash.
        Decoctions are easy!
      </p>

      <noscript>
        <p><em>You must enable JavaScript to use this tool.</em></p>
      </noscript>

      <form className="pure-form pure-g decoction-calc">
        <fieldset>
          <div className="pure-u-1">
            <div className="pure-u-3-5 pure-u-md-1-2 pull-right">
              <label htmlFor="dry-weight">Dry weight of grain (lb)</label>
            </div>
            <div className="pure-u-2-5 pure-u-md-1-2">
              <input type="number"
                id="dry-weight"
                min="0"
                max="50"
                value={dryWeight}
                onChange={(e) => setDryWeight(+e.target.value)}
                onFocus={handleFocus} />
            </div>
          </div>
          <div className="pure-u-1">
            <div className="pure-u-3-5 pure-u-md-1-2 pull-right">
              <label htmlFor="water-volume">Water volume (qt)</label>
            </div>
            <div className="pure-u-2-5 pure-u-md-1-2">
              <input type="number"
                id="water-volume"
                min="0"
                max="40"
                step="0.25"
                value={waterVolume}
                onChange={(e) => setWaterVolume(+e.target.value)}
                onFocus={handleFocus} />
            </div>
          </div>
          <div className="pure-u-1">
            <div className="pure-u-3-5 pure-u-md-1-2 pull-right">
              <label htmlFor="current-temp">Current mash temp (F)</label>
            </div>
            <div className="pure-u-2-5 pure-u-md-1-2">
              <input type="number"
                id="current-temp"
                min="0"
                max="212"
                value={currentTemperature}
                onChange={(e) => setCurrentTemperature(+e.target.value)}
                onFocus={handleFocus} />
            </div>
          </div>
          <div className="pure-u-1">
            <div className="pure-u-3-5 pure-u-md-1-2 pull-right">
              <label htmlFor="target-temp">Target mash temp (F)</label>
            </div>
            <div className="pure-u-2-5 pure-u-md-1-2">
              <input type="number"
                id="target-temp"
                min={currentTemperature || 0}
                max="211"
                value={targetTemperature}
                onChange={(e) => setTargetTemperature(+e.target.value)}
                onFocus={handleFocus} />
            </div>
          </div>
          <div className="pure-u-1 result">
            <div className="pure-u-3-5 pure-u-md-1-2 pull-right">
              <label>Decoction Volume (qt)</label>
            </div>  
            <div className="pure-u-2-5 pure-u-md-1-2">
              <span>{decoctionVolume || '?'}</span>
            </div>
          </div>
        </fieldset>
      </form>
      <p>
        Source:
        </p><p>
        <cite>How to Brew</cite>, by John J. Palmer, Fourth ed., Brewers Publications, 2017, p. 274-275. 
      </p>
    </PageContainer>
  );
};

export default DecoctionCalc;