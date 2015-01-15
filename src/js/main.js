require.config({
  baseUrl: '/js',
  paths: {
    jquery: '../../../../build/src/components/jquery/dist/jquery',
    lodash: '../../../../build/src/components/lodash/dist/lodash.compat',
    underscore: '../components/lodash/dist/lodash.compat',
    backbone: '../../../../build/src/components/backbone/backbone',
    'backbone.keys': 'libs/backbone.keys',
    'backbone.filtered.collection': 'libs/backbone.filtered.collection',
    bootstrap: 'libs/bootstrap/js/bootstrap',
    'backbone.identity': 'libs/backbone.identity',
    moment: '../../../../build/src/components/moment/moment',
    'jquery.fixedheader': 'libs/fixedheader',
    'jquery.sticky': 'libs/jquery.sticky',
    'jquery.rest': 'libs/jquery.rest',
    'jquery.pageslide': 'libs/jquery.pageslide.min',
    'jquery.fixedhead': 'libs/jquery.fixedhead',
    'jquery.expanding': 'libs/jquery.expanding',
    messenger: '../../../../build/src/components/messenger/build/js/messenger',
    sprintf: '../../../../build/src/components/sprintf/src/sprintf',
    'bootstrap.multiselect': 'libs/bootstrap-multiselect/js/bootstrap-multiselect',
    templates: '../templates',
    parallel: 'libs/parallel',
    settings: 'settings.dev',
    react: 'components/react/react',
    'messenger-theme-future': '../../../../build/src/components/messenger/build/js/messenger-theme-future',
    'messenger-theme-flat': '../../../../build/src/components/messenger/build/js/messenger-theme-flat',
    'backbone.localstorage': '../../../../build/src/components/backbone.localstorage/backbone.localStorage',
    chartjs: '../../../../build/src/components/chartjs/Chart.min',
    'jquery-ui': '../../../../build/src/components/jquery-ui/jquery-ui',
    prism: '../components/prism/prism'
  },
  shim: {
    backbone: {
      deps: [
        'underscore',
        'sprintf',
        'jquery',
        'jquery.rest',
        'jquery-ui',
        'bootstrap'
      ],
      exports: 'Backbone'
    },
    'backbone.keys': {
      deps: [
        'backbone'
      ]
    },
    'backbone.identity': {
      deps: [
        'backbone'
      ]
    },
    'backbone.filtered.collection': {
      deps: [
        'backbone'
      ]
    },
    localstorage: {
      deps: [
        'backbone'
      ]
    },
    dualstorage: {
      deps: [
        'backbone'
      ]
    },
    underscore: {
      exports: '_'
    },
    bootstrap: {
      deps: [
        'jquery'
      ]
    },
    'bootstrap.mulitselect': {
      deps: [
        'bootstrap'
      ],
      exports: 'jQuery.fn.multiselect'
    },
    'jquery.fixedhead': {
      deps: [
        'jquery'
      ],
      exports: 'jQuery.fn.fixedhead'
    },
    'jquery.fixedheader': {
      deps: [
        'jquery'
      ],
      exports: 'jQuery.fn.fixedHeader'
    },
    'jquery.sticky': {
      deps: [
        'jquery'
      ],
      exports: 'jQuery.fn.sticky'
    },
    'jquery.rest': {
      deps: [
        'jquery'
      ]
    },
    'jquery.ui': {
      deps: [
        'jquery'
      ]
    },
    'jquery.pageslide': {
      deps: [
        'jquery'
      ]
    },
    messenger: {
      deps: [
        'jquery',
        'backbone'
      ],
      exports: 'Messenger',
      init: function () {
this.Messenger.options = {
extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
theme: 'block'
};
}
    },
    chartjs: {
      exports: 'Chart'
    },
    prism: {
      exports: 'Prism'
    }
  },
  templates: '../templates',
  waitSeconds: 300,
  map: {
    '*': {
      underscore: 'lodash'
    }
  },
  packages: [

  ]
});

require([
// Load our app module and pass it to our definition function
'app'], function(App) {
  // The "app" dependency is passed in as "App"
  App.initialize();
  return App;
});
