// spin-button
import Ember from 'ember';

export
default Ember.Component.extend({

  tagName: 'span',
  showLoader: false,
  timeout: false,
  delay: 500,
  isLoading: false,

  updateLoader: function() {
    this.hideLoader();
  }.on('init'),

  buttonText: function() {
    if (!Em.isEmpty(this.get('text'))) {
      return this.get('text');
    }
    return 'Submit';
  }.property(),

  hideLoader: function() {
    if (this.get('isLoading')) {
      this.set('timeout', Ember.run.later(this, function() {
        if (this.isDestroyed || this.isDestroying) {
          return;
        }
        this.set('showLoader', true);
      }, this.get('delay')));
    }
    else {
      this.set('showLoader', false);
      Ember.run.cancel(this.get('timeout'));
    }
  }.observes('isLoading'),

  actions: {

    showLoading: function() {
      this.set('isLoading', true);
      this.sendAction('action');
    }

  }
});

