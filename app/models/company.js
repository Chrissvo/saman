import DS from 'ember-data';

export default DS.Model.extend({

  companyType: DS.attr('string'),
  incomeCategory: DS.attr('string'),
  energyUsage: DS.attr('number'),
  energyPrice: DS.attr('number', {
    defaultValue: 0.06
  }),
  factorOwnUsage: DS.attr('number', {
    defaultValue: 30
  }),
  connection: DS.attr('string'),
  otherInvestments: DS.attr('number', {
    defaultValue: 0
  }),

  customer: DS.belongsTo('customer')

});
