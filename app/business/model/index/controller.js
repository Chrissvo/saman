import Ember from 'ember';

export default Ember.Controller.extend({

  customerForm: false,
  companyForm: true,
  systemForm: false,
  customerId: undefined,
  companyId: undefined,
  systemId: undefined,

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

  connectionTypes: [
    'Aansluiting groter dan 3x80A',
    'Aansluiting kleiner dan of gelijk aan 3x80A'
  ],

  roofOrientations: [
    'W',
    'WWZ',
    'ZW',
    'ZZW',
    'Z',
    'ZZO',
    'ZO',
    'OOZ',
    'O'
  ],

  roofSlopes: [
    '0',
    '5',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
    '60',
    '65',
    '70',
    '75',
    '80',
    '85',
    '90'
  ],

  sdePhases: [
    'Fase 1 (vanaf 31 maart)',
    'Fase 2 (vanaf 20 april)',
    'Fase 3 (vanaf 11 mei)',
    'Fase 4 (vanaf 1 juni)',
    'Fase 5 (vanaf 22 juni)',
    'Fase 6 (vanaf 31 augustus)',
    'Fase 7 (vanaf 21 september)',
    'Fase 8 (vanaf 12 oktober)',
    'Fase 9 (vanaf 9 november)'
  ],

  applicationController: Ember.inject.controller('application'),

  actions: {

    saveCustomer: function(data) {
      return this.store.findAll('customer').then(function(customers) {
        // filter out because emberfire does not support query function
        customers = customers.filterBy('email', data.email);
        // success > query customer
        if (customers.get('length') < 1) {
          const newCustomer = this.store.createRecord('customer', data);
          newCustomer.save().then(function(customer) {
            // success
            this.set('customerId', customer.get('id'));
            // save company
            let company = this.store.peekRecord('company', this.get('companyId'));
            company.set('customer', customer);
            company.save().then(function() {
              // success > save model
              let system = this.store.peekRecord('system', this.get('systemId'));
              system.set('customer', customer);
              system.save().then(function() {
                // success > save system
                this.set('customerForm', false);
                return this.transitionToRoute('business.model.results');
              }.bind(this));
            }.bind(this));
          }.bind(this)).catch(function(error) {
            // fail
            return this.get('applicationController').notify({
              id: 'fail.saveCustomer',
              message: 'Opslaan van deze klant is mislukt! ' + error,
              type: 'error'
            });
          }.bind(this));
        }
        else {
          // customer exists
          const customer = customers.get('firstObject');
          this.set('customerId', customer.get('id'));
          // save customer
          customer.save(data).then(function(customer){
            // save company
            let company = this.store.peekRecord('company', this.get('companyId'));
            company.set('customer', customer);
            company.save().then(function() {
              // success > save model
              let system = this.store.peekRecord('system', this.get('systemId'));
              system.set('customer', customer);
              system.save().then(function() {
                // success > save system
                this.set('customerForm', false);
                return this.transitionToRoute('business.model.results');
              }.bind(this));
            }.bind(this));
          }.bind(this));
        }
      }.bind(this), function() {
        // fail
        return this.get('applicationController').notify({
          id: 'fail.saveCustomer',
          message: 'Opslaan van deze klant is mislukt! ' + error,
          type: 'error'
        });
      });

    },

    saveCompany: function(data) {
      const companyId = this.get('companyId');
      if (companyId) {
        let company = this.store.peekRecord('company', companyId);
        // check for wrong combinations of companyType and incomeCategory
        if (data.companyType === 'BV' || data.companyType === 'NV') {
          if (data.incomeCategory !== 'minder dan € 200.000' ||
            data.incomeCategory !== 'meer dan € 200.000') {
              data.incomeCategory = 'minder dan € 200.000';
          }
        }
        else {
          if (data.incomeCategory === 'minder dan € 200.000' ||
            data.incomeCategory === 'meer dan € 200.000') {
              data.incomeCategory = '€ 0 - € 18.628';
          }
        }
        // save the company with new data
        return company.save(data).then(function(){
          this.set('companyForm', false);
          return this.set('systemForm', true);
        }.bind(this));
      }
      const customerId = this.get('customerId');
      if (customerId) {
        data.customer = this.store.peekRecord('customer', customerId);
      }
      if (data.otherInvestments === undefined) {
        data.otherInvestments = "0";
      }
      const newCompany = this.store.createRecord('company', data);
      newCompany.save().then(function(company) {
        // success
        this.set('companyId', company.get('id'));
        this.set('companyForm', false);
        return this.set('systemForm', true);
      }.bind(this)).catch(function(error) {
        // fail
        return this.get('applicationController').notify({
          id: 'fail.saveCompany',
          message: 'Opslaan van dit bedrijf is mislukt! ' + error,
          type: 'error'
        });
      }.bind(this));
    },

    saveSystem: function(data) {
      const customerId = this.get('customerId');
      const companyId = this.get('companyId');
      const systemId = this.get('systemId');
      if (customerId) {
        data.customer = this.store.peekRecord('customer', customerId);
      }
      if (companyId === undefined) {
        // fail
        return this.get('applicationController').notify({
          id: 'fail.noCompany',
          message: 'Opslaan is mislukt, er zijn geen bedrijfsgegevens!',
          type: 'error'
        });
      }
      data.company = this.store.peekRecord('company', companyId);

      if(systemId) {
        const system = this.store.peekRecord('system', systemId);
        return system.save(data).then(function(system) {
          return this.transitionToRoute('business.model.results', {
            queryParams: {
              customer: data.customer,
              company: data.company,
              system: system
            }
          });
        }.bind(this));
      }
      const newSystem = this.store.createRecord('system', data);
      newSystem.save().then(function(system) {
        // success
        this.set('systemId', system.get('id'));
        this.set('systemForm', false);
        return this.transitionToRoute('business.model.results', {
          queryParams: {
            customer: data.customer,
            company: data.company,
            system: system
          }
        });
      }.bind(this)).catch(function(error) {
        // fail
        return this.get('applicationController').notify({
          id: 'fail.saveSystem',
          message: 'Opslaan van dit systeem is mislukt! ' + error,
          type: 'error'
        });
      }.bind(this));
    }

  }

});
