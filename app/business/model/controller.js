import Ember from 'ember';

export default Ember.Controller.extend({

  customerForm: true,
  companyForm: false,
  energyForm: false,
  customerId: undefined,

  companyType: 'Eenmanszaak',
  companyTypes: [
    'Eenmanszaak',
    'Maatschap',
    'CV',
    'VOF',
    'BV',
    'NV',
    'Stichting',
    'Vereniging'
  ],

  incomeCategory: '€ 0 - € 18.628',
  personalIncomeCategories: [
    '€ 0 - € 18.628',
    '€ 18.628 - € 33.426',
    '€ 33.426 - € 55.694',
    '€ 55.694 en hoger'
  ],
  corporateIncomeCategories: [
    'minder dan € 200.000',
    'meer dan € 200.000'
  ],

  connection: 'Aansluiting groter dan 3x80A',
  connectionTypes: [
    'Aansluiting groter dan 3x80A',
    'Aansluiting kleiner dan of gelijk aan 3x80A'
  ],

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

    saveCompany: function(data) {
      const customerId = this.get('customerId');
      if (customerId === undefined) {
        // fail
        return this.get('applicationController').notify({
          id: 'fail.noCustomer',
          message: 'Opslaan is mislukt, er zijn geen klantgegevens!',
          type: 'error'
        });
      }
      data.customer = this.store.peekRecord('customer', customerId);
      if (data.otherInvestments === undefined) {
        data.otherInvestments = "0";
      }
      const newCompany = this.store.createRecord('company', data);
      newCompany.save().then(function() {
        // success
        this.set('companyForm', false);
        return this.set('energyForm', true);
      }.bind(this)).catch(function(error) {
        // fail
        return this.get('applicationController').notify({
          id: 'fail.saveCompany',
          message: 'Opslaan van dit bedrijf is mislukt! ' + error,
          type: 'error'
        });
      }.bind(this));
    }

  }

});
