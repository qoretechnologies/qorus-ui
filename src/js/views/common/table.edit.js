define(function (require) {
  var _           = require('underscore'),
      Qorus       = require('qorus/qorus'),
      moment      = require('moment'),
      utils       = require('utils'),
      settings    = require('settings'),
      datepicker  = require('views/common/datetimepicker'),
      ConfirmView = require('views/common/confirm'),
      View;
  
  View = Qorus.ModelView.extend({
    defaultEvents: {
      "click td.editable": "editTableCell"
    },
    prepareData: function (data) {
      return data;
    },
    editTableCell: function (e) {
      var $row   = $(e.currentTarget),
          value  = $row.data('value'),
          $input = $('<input type="text" />'),
          self   = this;
          
      function save (val) {
        var data     = $row.data();
      
        if (moment.isMoment(val))
          val = val.format(settings.DATE_DISPLAY);

        data[data.name] = val;

        self.model.doAction(data.action, self.prepareData(data));
        value = val;
        $row.data('value', value);
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
            self.views.datepicker.close();
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
        
        $input.on('keypress', function (e) {
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
  
  return View;
});