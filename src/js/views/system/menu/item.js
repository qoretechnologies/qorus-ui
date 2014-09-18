define(function (require) {
  var Qorus    = require('qorus/qorus'),
      Template = require('text!templates/system/menu/item.html'),
      View;
  
  View = Qorus.ModelView.extend({
    tagName: 'li',
    template: Template
  });
  
  return View;
});
