define(function (require) {
  var $          = require('jquery'),
      _          = require('underscore'),
      settings   = require('settings'),
      utils      = require('utils'),
      Qorus      = require('qorus/qorus'),
      Collection = require('collections/options'),
      Template   = require('text!templates/system/options/list.html'),
      RowTpl     = require('text!templates/system/options/row.html'),
      TableTpl   = require('text!templates/system/options/table.html'),
      datepicker      = require('views/common/datetimepicker'),
      ConfirmView     = require('views/common/confirm'),
      ListView, RowView;

      require('jquery.ui');
  
  
  RowView = Qorus.RowView.extend({
    additionalEvents: {
      "click td[data-editable]": "editTableCell"
    },
    editTableCell: function (e) {
      var $row   = $(e.currentTarget),
          value  = $row.text(),
          $input = $('<input type="text" />'),
          self   = this;
          
      function save (val) {
        var data     = {},
            property = $row.data('name');
      
        if (moment.isMoment(val))
          val = val.format(settings.DATE_DISPLAY);

        data[property] = val;
        self.model.setValue(val);
        clean();
      }
    
      function clean (e) {
        if (e && $(e.target).closest('.datepicker').length) {
        
        } else {
          $input.off().remove();
          $row
            .text(value)
            .toggleClass('editor')
            .removeClass('invalid')
            .width('');
      
          if ($row.data('type') === 'date') {
            self.stopListening(self.views.datepicker);
            self.views.datepicker.off();
            $(document).off('click.datepickerout');
          }
        }
      }
    
      function saveOrClean(e) {
        var $target  = $(e.currentTarget),
            val      = $target.val();
      
        if ($target.key === 13 || e.which === 13) {
          if (utils.validate(val, $row.data('type'))) {
            save(val);
            value = val;
          } else {
            $row.addClass('invalid');
            $target.focus();
          }
        } else {
          clean(e);
        }
      
        e.preventDefault();
      }
      
      if (!$row.hasClass('editor')) {
        $row.width($row.width());
        $row.addClass('editor');
        $input.val(value);
        $row.empty();
        $row.append($input);
        $input.focus();
        
        if ($row.data('type') === 'date') {
          this.views.datepicker = new datepicker();
          this.views.datepicker.show(e);
          this.listenTo(this.views.datepicker, 'applyDate', save);
          $(document).on('click.datepickerout', clean);
        } else if ($row.data('type') === 'boolean') {
          this.views.confirm = new ConfirmView({ title: 'Are you sure', element: $row });
          this.listenTo(this.views.confirm, 'confirm', save);
          this.listenTo(this.views.confirm, 'dismiss', clean);
        } else {
          $input.blur(saveOrClean);
        }
        
        $input.on('keydown', function (e) {
           if (e.keyCode === 13 || e.which === 13) {
             saveOrClean(e);
           } else if (e.keyCode === 27 || e.which === 27) {
             clean();
           }
        });
        
        e.stopPropagation();
      }
    },
  });
  
  
  ListView = Qorus.ListView.extend({
    __name__: 'OptionsView',
    
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
      // this.listenTo(this.collection, 'sync resort', this.render);
    },
    preRender: function () {
      this.setView(new Qorus.TableView({
        template: TableTpl,
        row_view: RowView,
        row_template: RowTpl,
        collection: this.collection
      }), '#system-options-list');
    }
  });
  
  return ListView;
});
