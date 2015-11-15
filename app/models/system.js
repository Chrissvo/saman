import DS from 'ember-data';

export default DS.Model.extend({

  panelAmount: DS.attr('number'),
  panelPower: DS.attr('number', {
    defaultValue: 265
  }),
  panelPrice: DS.attr('number', {
    defaultValue: 0.95
  }),

  roofOrientation: DS.attr('string'),
  roofSlope: DS.attr('number'),

  sdePhase: DS.attr('string'),
  apxPrice: DS.attr('number', {
    defaultValue: 0.045
  }),

  customer: DS.belongsTo('customer'),
  company: DS.belongsTo('company')

});
