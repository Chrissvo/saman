/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'solarcalculation',
    environment,
    contentSecurityPolicy: {
      'connect-src': "'self' https://auth.firebase.com wss://*.firebaseio.com",
      'img-src': "'self' https://saman.christian.surf/assets/images/",
      'font-src': "'self https://fonts.gstatic.com http://netdna.bootstrapcdn.com/font-awesome/",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com/",
      'script-src': "'self' https://*.firebaseio.com",
      'default-src': "'self' https://*.firebaseio.com"
    },
    firebase: {
      apiKey: "AIzaSyDBlSmEBqoTkmSndfSyA7fFSGMS6s-ncCs",
      authDomain: "solarcalculation.firebaseapp.com",
      databaseURL: "https://solarcalculation.firebaseio.com",
      storageBucket: "solarcalculation.appspot.com",
    },
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
