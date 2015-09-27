import Ember from 'ember';

export default Ember.Route.extend({

  actions: {

    submit: function(systemId) {
      return this.transitionTo('business.model.results', {
        queryParams: {
          systemId: systemId
        }
      });
    }

  }

});
