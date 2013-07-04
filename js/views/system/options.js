define([
  'jquery',
  'underscore',
  'backbone',
  'settings',
  'qorus/qorus',
  'models/system',
  'collections/options',
  'text!../../../templates/system/options.html',
  'text!../../../templates/common/option_edit.html',
  'jquery.ui'
], function($, _, Backbone, settings, Qorus, System, Collection, Template, EditTemplate){
  var input_map = {
    'integer': ['input', 'number'],
    'bool': ['input', 'text'],
    'string': ['input', 'text'],
    'string': ['input', 'text'],
  }
  
  var EDIT_URL = settings.REST_API_PREFIX + '/system/options';
  
  var ListView = Qorus.ListView.extend({
    additionalEvents: {
      "click td[data-editable]": "editOption",
    },
    
    initialize: function (opts) {
      _.bindAll(this);
      this.opts = opts || {};
      ListView.__super__.initialize.call(this, opts);
      
      this.collection = new Collection(this.opts);
      this.template = Template;
 
      this.collection.fetch();
      this.listenTo(this.collection, 'sync', function (e) { console.log('synced', e)});
      this.listenTo(this.collection, 'sync resort', this.render);
    },
    
    editOption: function (e) {
      var _this = this;
      
      if (e.target.localName == 'td') {
        var $target = $(e.currentTarget);
        var value = $target.data('value');
        var obj_type = $target.data('type');
        var name = $target.data('name');
        var template = _.template(EditTemplate, { 
          value: value,
          type: input_map[obj_type][1],
          name: name
        });
        
        $tpl = template;
        $target.toggleClass('editable');
        $target.html($tpl);
        
        $('button[data-action=cancel]', $target).click(function () {
          $target.html(value);
          $target.toggleClass('editable');
        });
        
        $('button[data-action=set]').click(function () {
          var val = $(this).prev('input').val();
          _this.setOption(name, val, $target);
        });
        
        $('input').keypress(function (e) {
          if(e.which == 13) {
            _this.setOption(name, $(this).val(), $target);
          }
        });
      }
    },
      
    setOption: function (option, value, target) {
      var url = EDIT_URL + '/' + option;
      $.put(url, { action: 'set', value: value})
        .done(function (data) {
          target.html(value);
          target.toggleClass('editable');
          target.data('value', value);
        });
    }
  });
  
  return ListView;
});