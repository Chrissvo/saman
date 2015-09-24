import Ember from 'ember';

export default Ember.Controller.extend({

  customerForm: true,
  companyForm: false,
  customerId: undefined,
  applicationController: Ember.inject.controller('application'),

  actions: {

    saveCustomer: function(data) {
      const newCustomer = this.store.createRecord('customer', data);
      newCustomer.save().then(function(customer) {
        // success
        this.set('customerId', customer.get('id'));
        this.set('customerForm', false);
        return this.set('companyForm', true);
      }.bind(this)).catch(function(error) {
        // fail
        return this.get('applicationController').notify({
          id: 'fail.saveCustomer',
          message: 'Opslaan van deze klant is mislukt! ' + error,
          type: 'error'
        });
      }.bind(this));
    },
          type: 'error'
        });
      }.bind(this));
    }
  }

});
