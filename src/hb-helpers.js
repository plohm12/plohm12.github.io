import Handlebars from 'handlebars';

const helpers = {};

const FIXED_NUM = 'fixedNum';
export const fixedNum = (value, decimalPlaces) => (+value).toFixed(decimalPlaces || 0);
helpers[FIXED_NUM] = fixedNum;

const DATE = 'date';
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC'
});
export const date = (value) => {
  if (!value) {
    return '';
  }
  let [year, month, day] = value.split('-');
  const date = new Date(Date.UTC(+year, +month - 1, +day));
  const parts = dateFormatter.formatToParts(date);
  year = parts.find(p => p.type === 'year').value;
  month = parts.find(p => p.type === 'month').value;
  day = parts.find(p => p.type === 'day').value;
  return `${year} ${month} ${day}`;
};
helpers[DATE] = date;

const MULTILINE = 'multiline';
export const multiline = (value) => !value ? ''
  : typeof value === 'string' ? new Handlebars.SafeString(`<p>${value}</p>`)
  : Array.isArray(value) ? new Handlebars.SafeString(`<p>${value.join('</p><p>')}</p>`)
  : '';
helpers[MULTILINE] = multiline;

const addHelpers = () => {
  Object.keys(helpers).map(key => {
    Handlebars.registerHelper(key, helpers[key]);
  });
};

export default addHelpers;
