import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: ['systemId'],

  situationData: function() {
    return [{
      label: 'Juridische bedrijfsvorm',
      value: this.get('model.company.companyType')
    }, {
      label: 'Inkomen / winst',
      value: this.get('model.company.incomeCategory')
    }, {
      label: 'Huidig verbruik',
      value: this.get('model.company.energyUsage').toFixed(0) + ' kWh/jaar'
    }, {
      label: 'Netto energieprijs',
      value: '€ ' + this.get('model.company.energyPrice').toFixed(3) + ' per kWh'
    }, {
      label: 'Factor eigen verbruik',
      value: this.get('model.company.factorOwnUsage').toFixed(0) + '%'
    }, {
      label: 'Aansluiting',
      value: this.get('model.company.connection')
    }];
  }.property(),

});
