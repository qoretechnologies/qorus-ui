define(function (require) {
  var _                = require('underscore'),
      Helpers          = require('qorus/helpers'),
      availableFilters = require('constants/workflow').AVAILABLE_FILTERS;

  var pickOptions = _.curry(function (filters, options) {
    return _.pick(options, filters);
  });

  var makeFiltersArray = _.curry(function (filters) {
    return _.reduce(filters, function (memo, v, k) {
      if (v) memo.push(k); return memo;
    }, []);
  });

  var getFilters = _.compose(makeFiltersArray, pickOptions(availableFilters));

  return {
    getFilters: getFilters,
    makeFiltersArray: makeFiltersArray,
    pickOptions: pickOptions
  };
});
