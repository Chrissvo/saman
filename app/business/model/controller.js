import Ember from 'ember';

export default Ember.Controller.extend({

  customerForm: true,
  companyForm: false,
  applicationController: Ember.inject.controller('application'),

  actions: {

    saveCustomer: function(data) {
      const newCustomer = this.store.createRecord('customer', data);
      newCustomer.save().then(function() {
        // success
        this.set('customerForm', false);
        return this.set('companyForm', true);
      }.bind(this)).catch(function(error) {
        // fail
        return this.get('applicationController').notify({
          id: 'fail.saveCustomer',
          message: 'Opslaan is mislukt! ' + error,
          type: 'error'
        });
      }.bind(this));
    }
  }

});
