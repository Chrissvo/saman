import Ember from 'ember';

export default Ember.Controller.extend({

  currentPath: '',
  notifications: [],

  updateCurrentPath: function() {
    this.set('currentPath', this.get('currentPath'));
  }.observes('currentPath'),

  notify: function(notification) {
    if (notification.id && notification.message && notification.type) {
      this.get('notifications').addObject(notification);
    }

    else {
      notification = {
        id: notification.id ? notification.id : 'unknown.id',
        message: notification.message ? notification.message : 'Unknown error',
        type: notification.type ? notification.type : 'error'
      };
      this.get('notifications').addObject(notification);
    }
    if (notification.type === 'success') {
      Ember.run.later((function() {
        this.send('deleteNotification', notification.id);
      }.bind(this)), 2000);
    }
  },

  actions: {

    deleteNotification: function(notificationId) {
      var notifications = this.get('notifications');
      for (var key in notifications) {
        if (notifications.hasOwnProperty(key)) {
          if (notifications[key]) {
            if (notifications[key].hasOwnProperty('id')) {
              if (notifications[key].id === notificationId) {
                delete notifications[key];
                this.set('notifications', notifications);
                this.get('notifications').removeObject();
              }
            }
          }
        }
      }
    }
  }

});
