import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params, transition) {
    let customer = transition.queryParams.customer;
    let company = transition.queryParams.company;
    let system = transition.queryParams.system;
    const applicationController = this.container.lookup('controller:application');

    if (params.systemId) {

      const systemId = params.systemId;

      system = new Ember.RSVP.Promise(function(resolve) {
        return resolve(this.store.findRecord('system', systemId).catch(function(error) {
          // fail
          return applicationController.notify({
            id: 'results.no_model',
            message: 'Model is niet gevonden. ' + error,
            type: 'error'
          });
        }));
      }.bind(this));

      company = new Ember.RSVP.Promise(function(resolve) {
        return system.then(function(system) {
          if (system === undefined) {
            return resolve();
          }
          if (system.get('company') === undefined) {
            //fail
            return applicationController.notify({
              id: 'results.no_company_id',
              message: 'Bedrijfs ID is niet gevonden.',
              type: 'error'
            });
          }
          return resolve(this.store.findRecord('company', system.get('company.id')).catch(function(error) {
            //fail
            return applicationController.notify({
              id: 'results.no_company',
              message: 'Bedrijfsgegevens zijn niet gevonden. ' + error,
              type: 'error'
            });
          }.bind(this)));
        }.bind(this));
      }.bind(this));

      customer = new Ember.RSVP.Promise(function(resolve) {
        return system.then(function(system) {
          if (system === undefined) {
            return resolve();
          }
          if (system.get('customer.id') === undefined) {
            return resolve(undefined);
          }
          return this.store.findRecord('customer', system.get('customer.id')).then(function(customer) {
            return resolve(customer);
          }).catch(function(error) {
            //fail
            return applicationController.notify({
              id: 'results.no_customer',
              message: 'Klantgegevens zijn niet gevonden. ' + error,
              type: 'error'
            });
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }
    else {
      if (!company || !system) {
        return applicationController.notify({
          id: 'results.no_data',
          message: 'Berekening mislukt, onvoldoende data...',
          type: 'error'
        });
      }
    }

    return Ember.RSVP.hash({
      customer: customer,
      company: company,
      system: system
    });
  },

  afterModel: function(model) {
    if (model.company) {
      model.company.reload();
    }
    if (model.system) {
      model.system.reload();
    }
    if (model.customer) {
      model.customer.reload();
    }
  },

  actions: {

    returnToPrevious: function() {
      return history.back();
    },

    goToCustomer: function(systemId, companyId) {
      this.controllerFor('business.model.index').set('systemId', systemId);
      this.controllerFor('business.model.index').set('companyId', companyId);
      this.controllerFor('business.model.index').set('customerForm', true);
      this.controllerFor('business.model.index').set('companyForm', false);
      return this.transitionTo('business.model.index');
    },

    goToCompany: function(systemId, companyId) {
      this.controllerFor('business.model.index').set('systemId', systemId);
      this.controllerFor('business.model.index').set('companyId', companyId);
      this.controllerFor('business.model.index').set('customerForm', false);
      this.controllerFor('business.model.index').set('companyForm', true);
      return this.transitionTo('business.model.index');
    }

  }

});
