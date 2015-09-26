import DS from 'ember-data';

export default DS.Model.extend({

  companyType: DS.attr('string'),
  incomeCategory: DS.attr('string'),
  energyUsage: DS.attr('number'),
  energyPrice: DS.attr('number'),
  factorOwnUsage: DS.attr('number'),
  connection: DS.attr('string'),
  otherInvestments: DS.attr('number'),

  customer: DS.belongsTo('customer')

});
