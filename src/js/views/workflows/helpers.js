define(function (require) {
  var _             = require('underscore'),
      qorus_helpers = require('qorus/helpers'),
      utils         = require('utils'),
      ORDER_STATES  = require('constants/workflow').ORDER_STATES,
      StatusListTpl = require('tpl!templates/common/status_list.html'),
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
    },
    
    statusList: function (workflow) {
      var ctx = {};
      ctx.states = _.filter(ORDER_STATES, function (st) {
        var count = workflow[st.name];
        if (count > 0) {
          st.count = count; 
          return true;
        }
        return false;
      });
      ctx.getStatusCSS = qorus_helpers.getStatusCSS;
      return StatusListTpl(ctx);
    }
  });
    
  return helpers;
});