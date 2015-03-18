define(function (require) {
  var Reflux = require('reflux');
  
  return function () {
    return Reflux.createActions([
      'setCollection',
      'rowCheck',
      'rowClick',
      'filterChange',
      'check',
      'run',
      'sort'
    ]);
  };
});