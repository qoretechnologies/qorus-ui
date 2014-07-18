define(function (require) {
  var $            = require('jquery'),
      _            = require('underscore'),
      settings     = require('settings'),
      utils        = require('utils'),
      Qorus        = require('qorus/qorus'),
      Collection   = require('collections/options'),
      Template     = require('text!templates/system/options.html'),
      EditTemplate = require('text!templates/common/option_edit.html'),
      EDIT_URL     = settings.REST_API_PREFIX + '/system/options',
      ListView;

      require('jquery.ui');
  
  ListView = Qorus.ListView.extend({
    cls: 'OptionsView',
    additionalEvents: {
      "click td[data-editable]": "editOption"
    },
    
    initialize: function (opts) {
      this.opts = opts || {};
      // ListView.__super__.initialize.call(this, opts);
      this.views = {};
      this.context = {};
      this.options = {};
      
      this.collection = new Collection(this.opts);
      this.template = Template;
 
      this.collection.fetch();
      // this.listenTo(this.collection, 'all', function (e) { debug.log('options', e)});
      this.listenTo(this.collection, 'sync resort', this.render);
    },
    
    editOption: function (e) {
      var self    = this, 
          $target = $(e.currentTarget),
          value, obj_type, name, template, $tpl;
      
      if ($(e.target).is('td')) {
        value = $target.data('value');
        obj_type = $target.data('type');
        name = $target.data('name');
        template = _.template(EditTemplate, { 
          value: value,
          type: utils.input_map[obj_type][1],
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
          self.setOption(name, val, $target);
        });
        
        $('input').keypress(function (e) {
          if (e.which == 13) {
            self.setOption(name, $(this).val(), $target);
          }
        });
      }
    },
      
    setOption: function (option, value, target) {
      var url = EDIT_URL + '/' + option;
      $.put(url, { action: 'set', value: value})
        .done(function () {
          target.html(value);
          target.toggleClass('editable');
          target.data('value', value);
        });
    }
  });
  
  return ListView;
});
