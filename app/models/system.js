import DS from 'ember-data';

export default DS.Model.extend({

  panelAmount: DS.attr('number'),
  panelPower: DS.attr('number'),
  panelPrice: DS.attr('number'),

  roofOrientation: DS.attr('string'),
  roofSlope: DS.attr('number'),

  sdePhase: DS.attr('string'),
  apxPrice: DS.attr('number'),

  customer: DS.belongsTo('customer'),
  company: DS.belongsTo('company')

});
