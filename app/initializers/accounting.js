// accounting

import { currency, number } from 'accounting/settings';

export default {
  name: 'accounting.js',
  initialize: function() {
    currency.symbol = '€';
    currency.precision = 2;
    currency.format = '%s %v';
    currency.decimal = ',';
    currency.thousand = '.';

    number.decimal = ',';
    number.thousand = '.';
  }
};