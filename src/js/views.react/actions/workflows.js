define(function (require) {
  var Reflux = require('reflux');
  
  return Reflux.createActions([
    "toggleDetail",
    "dateChange",
    "filterChange",
    "setCollection",
    "unsetCollection",
    "fetch"
  ]);
});