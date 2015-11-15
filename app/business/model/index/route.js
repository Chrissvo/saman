import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {

    if (this.controllerFor('business.model.index').get('companyId') &&
      this.controllerFor('business.model.index').get('systemId')) {
      return this.modelFor('business.model.results');
    }

    var company = new Ember.RSVP.Promise(function(resolve) {
      return resolve(this.store.createRecord('company', {
        companyType: 'Eenmanszaak',
        incomeCategory: '€ 0 - € 18.628',
        connection: 'Aansluiting groter dan 3x80A'
      }));
    }.bind(this));

    var system = new Ember.RSVP.Promise(function(resolve) {
      return resolve(this.store.createRecord('system', {
        roofOrientation: 'W',
        roofSlope: '0',
        sdePhase: 'Fase 1 (vanaf 31 maart)'
      }));
    }.bind(this));

    return Ember.RSVP.hash({
      company: company,
      system: system
    });
  }

});
