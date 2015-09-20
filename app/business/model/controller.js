import Ember from 'ember';

export default Ember.Controller.extend({

  customerForm: true,

  actions: {

    saveCustomer: function(data) {
      this.store.createRecord('customer', data);
    }

  }

});
