define(function (require) {
  var constants = {};
  
  /**
    Defines order states definitions and its acronyms
    @const {array}
  */
  constants.ORDER_STATES = [
    { name: 'IN-PROGRESS', short: 'I'},
    { name: 'READY', short: 'Y'},
    { name: 'SCHEDULED', short: 'S'},
    { name: 'COMPLETE', short: 'C'},
    { name: 'INCOMPLETE', short: 'N'},
    { name: 'ERROR', short: 'E'},
    { name: 'CANCELED', short: 'Y'},
    { name: 'RETRY', short: 'R'},
    { name: 'WAITING', short: 'W'},
    { name: 'ASYNC-WAITING', short: 'A'},
    { name: 'EVENT-WAITING', short: 'V'},
    { name: 'BLOCKED', short: 'B'},
    { name: 'CRASH', short: 'C'},
  ];
  
  return constants;
});