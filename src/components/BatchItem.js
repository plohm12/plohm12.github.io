import React from 'react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC'
});
const formatDate = (value) => {
  if (!value) {
    return '';
  }
  let [year, month, day] = value.split('-');
  const date = new Date(Date.UTC(+year, +month - 1, +day));
  const parts = dateFormatter.formatToParts(date);
  year = parts.find(p => p.type === 'year').value;
  month = parts.find(p => p.type === 'month').value;
  day = parts.find(p => p.type === 'day').value;
  return `${month} ${day}, ${year}`;
};

const RecipeWrapper = ({recipeId, isPublic, children}) => recipeId && isPublic
  ? <a href={`https://www.brewersfriend.com/homebrew/recipe/view/${recipeId}`} target="_blank">
      {children}
    </a>
  : children;

const BatchItem = ({code, name, style, abv, ibu, brewed, bottled, recipeId, isPublic, capCode, notBottled}) => {
  const ibuValue = +ibu;
  let displayName = capCode ? `${capCode} – ${name}` : name;
  return (
    notBottled
    ? <div className="pure-u-1 list-row">
        <div className="pure-u-2-3">
          <div className="pure-u-1 pure-u-md-1-2 list-row-value">
            <RecipeWrapper recipeId={recipeId} isPublic={isPublic}>
              <span>{displayName}</span>
            </RecipeWrapper>
          </div>
          <div className="pure-u-1 pure-u-md-1-2 list-row-value"><span>{style}</span></div>
        </div>
        <div className="pure-u-1-3">
          <div className="list-row-value"><span>{formatDate(brewed)}</span></div>
        </div>
      </div>
    : <div className="pure-u-1 list-row">
        <div className="pure-u-1-2">
          <div className="pure-u-1 pure-u-md-2-3 list-row-value">
            <RecipeWrapper recipeId={recipeId} isPublic={isPublic}>
              <span>{displayName}</span>
            </RecipeWrapper>
          </div>
          <div className="pure-u-1 pure-u-md-1-3 list-row-value"><span>{style}</span></div>
        </div>
        <div className="pure-u-1-6">
          <div className="pure-u-1 pure-u-md-1-2 list-row-value"><span>{(+abv).toFixed(1)}%</span></div>
          <div className="pure-u-1 pure-u-md-1-2 list-row-value"><span>{!!ibuValue ? (ibuValue).toFixed(0) : '-'}</span></div>
        </div>
        <div className="pure-u-1-3">
          <div className="pure-u-1 pure-u-md-1-2 list-row-value"><span>{formatDate(brewed)}</span></div>
          <div className="pure-u-1 pure-u-md-1-2 list-row-value"><span>{formatDate(bottled)}</span></div>
        </div>
      </div>
  );
};

export default BatchItem;
