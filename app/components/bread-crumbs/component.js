import Ember from 'ember';

export default Ember.Component.extend({

  currentPath: function() {
    return this.container.lookup('controller:application').get('currentPath');
  }.property(),

  breadCrumb: function() {
    const currentPath = this.get('currentPath');
    let breadCrumb;
    switch (currentPath) {
      case 'index':
        breadCrumb = '';
        break;
      case 'business.model':
        breadCrumb = 'Zakelijk Rekenmodel';
        break;
      case 'search':
        breadCrumb = 'Model Ophalen';
        break;
    }
    return breadCrumb;
  }.property()

});
