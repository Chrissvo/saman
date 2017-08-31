import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('business', function() {
    this.route('model', function() {
      this.route('results');
    });
  });
  this.route('search');
  this.route('loading');
});

export default Router;
