define(function (require) {
  var _             = require('underscore'),
      qorus_helpers = require('qorus/helpers'),
      ControlsTpl   = require('tpl!templates/common/controls.html'),
      utils         = require('utils'),
      helpers;
  
  helpers = _.extend(_.clone(qorus_helpers), {
    getUrl: function (s, id, date) {
          var params = ['/workflows/view', id, 'orders', s];
          date = date || this.date || null;

          if (date) {
            // encode for URL
            date = utils.encodeDate(date);
            params.push(date);
          }

          return params.join('/');
    },
  
    wrapBadge: function (v, u, e){
      var res = '<a href="' + u +'">'+ v +'</a>';
      if (v < 1) {
        return res;
      }
      return '<span class="badge ' + e + '">' + res + '</span>';
    }
  });
    
  return helpers;
});
