import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  
  location: config.locationType,

  notifyGoogleAnalytics: function() {
    return ga('send', 'pageview', {
      'page': this.get('url'),
      'title': this.get('url')
    });
  }.on('didTransition')

});

Router.map(function() {
  this.route('business', function() {
    this.route('model', function() {
      this.route('results');
    });
  });
  this.route('search');
});

export default Router;
