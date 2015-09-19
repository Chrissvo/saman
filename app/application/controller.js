import Ember from 'ember';

export default Ember.Controller.extend({

  currentPath: '',

  updateCurrentPath: function() {
    this.set('currentPath', this.get('currentPath'));
  }.observes('currentPath')

});
