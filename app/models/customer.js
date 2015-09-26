import DS from 'ember-data';

export default DS.Model.extend({

  name: DS.attr('string'),
  address: DS.attr('string'),
  zip: DS.attr('string'),
  city: DS.attr('string'),
  email: DS.attr('string'),
  phone: DS.attr('string'),

  companies: DS.hasMany('company'),
  systems: DS.hasMany('system')

});
