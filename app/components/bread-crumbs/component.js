import Ember from 'ember';

export default Ember.Component.extend({

  currentPath: function() {
    return this.container.lookup('controller:application').get('currentPath');
  }.property(),

  breadCrumbs: function() {
    const currentPath = this.get('currentPath');
    let breadCrumbs;
    switch (currentPath) {
      case 'index':
        breadCrumbs = [''];
        break;
      case 'business.model.index':
        breadCrumbs = ['Zakelijk Rekenmodel'];
        break;
      case 'business.model.results':
        this.set('multiple', true);
        breadCrumbs = ['Zakelijk Rekenmodel', 'Resultaten'];
        break;
      case 'search':
        breadCrumbs = ['Model Ophalen'];
        break;
    }
    return breadCrumbs;
  }.property()

});
