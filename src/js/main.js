
require.config({
  baseUrl: '/js',
  paths: {
    jquery: '../components/jquery/dist/jquery',
    lodash: '../components/lodash/dist/lodash.compat',
    underscore: '../components/lodash/dist/lodash.compat',
    backbone: '../components/backbone/backbone',
    'backbone.keys': 'libs/backbone.keys',
    'backbone.filtered.collection': 'libs/backbone.filtered.collection',
    bootstrap: 'libs/bootstrap/js/bootstrap',
    'backbone.identity': 'libs/backbone.identity',
    moment: '../components/moment/moment',
    'jquery.fixedheader': 'libs/fixedheader',
    'jquery.sticky': 'libs/jquery.sticky',
    'jquery.rest': 'libs/jquery.rest',
    'jquery.pageslide': 'libs/jquery.pageslide.min',
    'jquery.fixedhead': 'libs/jquery.fixedhead',
    'jquery.expanding': 'libs/jquery.expanding',
    messenger: '../components/messenger/build/js/messenger',
    sprintf: '../components/sprintf/src/sprintf',
    'bootstrap.multiselect': 'libs/bootstrap-multiselect/js/bootstrap-multiselect',
    templates: '../templates',
    parallel: 'libs/parallel',
    settings: 'settings.dev',
    'messenger-theme-future': '../components/messenger/build/js/messenger-theme-future',
    'messenger-theme-flat': '../components/messenger/build/js/messenger-theme-flat',
    'backbone.localstorage': '../components/backbone.localstorage/backbone.localStorage',
    chartjs: '../components/chartjs/Chart',
    'jquery-ui': '../components/jquery-ui/jquery-ui',
    prism: '../components/prism/prism',
    jsx: '../components/jsx/jsx',
    react: '../components/react/react-with-addons',
    JSXTransformer: '../components/react/JSXTransformer',
    'react.backbone': '../components/react.backbone/react.backbone',
    reflux: '../components/reflux/dist/reflux',
    flatstrap: '../components/flatstrap/dist/js/flatstrap',
    'bootstrap-flat-ui': '../components/bootstrap-flat-ui/docs/assets/js/bootstrap',
    'flat-ui': '../components/flat-ui/dist/js/flat-ui',
    'snap.svg': '../components/snap.svg/dist/snap.svg-min',
    'fixed-data-table': '../components/fixed-data-table/index',
    'js-md5': '../components/js-md5/js/md5',
    Rainbow: '../components/Rainbow/rainbow',
    'spark-md5': '../components/spark-md5/spark-md5',
    classnames: '../components/classnames/index',
    'deep-diff': '../components/deep-diff/index',
    'react-chartjs': '../components/react-chartjs/react-chartjs',
    'react-shim': './react-shim',
    'es6-shim': '../components/es6-shim/es6-shim',
    'react-fixed-data-table': '../components/react-fixed-data-table/fixed-data-table',
    'backbone.obscura': '../components/backbone.obscura/backbone.obscura'
  },
  shim: {
    backbone: {
      deps: [
        'lodash',
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
    'jquery-ui': {
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
    },
    react: {
      exports: 'React'
    },
    'fixed-data-table': {
      deps: [
        'es6-shim'
      ]
    },
    JSXTransformer: 'JSXTransformer'
  },
  templates: '../templates',
  waitSeconds: 300,
  jsx: {
    fileExtension: '.jsx',
    transformOptions: {
      harmony: true,
      stripTypes: false
    },
    usePragma: false
  },
  packages: [

  ],
  map: {
    '*': {
      underscore: 'lodash',
      Chartjs: 'chartjs'
    }
  }
});

require([
// Load our app module and pass it to our definition function
'app'], function(App) {
  // The "app" dependency is passed in as "App"
  App.initialize();
  return App;
});
