define(function (require) {
  var actions = require('views.react/workflows/actions/table'),
      store   = require('views.react/stores/table');

  return store(actions);
});