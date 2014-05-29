define(function (require) {
  var $           = require('jquery'),
      settings    = require('settings'),
      Qorus       = require('qorus/qorus'),
      Template    = require('tpl!templates/common/datepicker/datepicker.html'),
      CalendarTpl = require('tpl!templates/common/datepicker/calendar.html'),
      moment      = require('moment'),
      Datepicker;
      
  Datepicker = Qorus.View.extend({
    additionalEvents: {
      'click [data-toggle]': 'processClick',
      'change input[name=hours],input[name=minutes]': 'processHours',
      'click [data-value=submit]': 'applyDate',
      'click [data-value=24h]': 'setToday',
      'click [data-value=all]': 'setAll',
      'click .reset-time': 'resetTime',
      'click': 'preventDefault'
    },
    
    tagName: 'div',
    className: 'datepicker hide',
    id: function () {
      return "datepicker-" + this.cid;
    },
    
    template: Template,
    initialize: function (options) {
      this.context = {};
      this.views = {};
      this.options = options || {};
      this.options.date = this.options.date || moment();
      
      if (!moment.isMoment(this.options.date)) {
        this.options.date = moment(this.options.date);
      }

      this.options.month = this.options.date.month();
      this.options.year = this.options.date.year();
      
      this.$input_el = $(this.options.element + ' input');
      this.$el.appendTo('body');
    },
        
    getDaysInMonth: function () {
      var month = this.options.month,
          year  = this.options.year,
          start = moment([year, month]).startOf('isoweek'),
          end   = start.clone().add('weeks', 6).add('days', -1),
          days  = [],
          date = this.options.date;

      
      while (start.valueOf() <= end.valueOf()) {
        var day = { date: start.date(), month: start.month(), year: start.year(), css: '' };
        
        if (start.valueOf() === moment([moment().year(), moment().month(), moment().date()]).valueOf()) day.is_today = true;
        if (start.valueOf() === moment([date.year(), date.month(), date.date()]).valueOf()) day.active = true;
        
        if (start.month() < month) day.css = 'old';
        if (start.month() > month) day.css = 'new';
        if (day.is_today) day.css += ' today';
        if (day.active) day.css += ' active';
        
        days.push(day);
        start.add('days', 1);
      }
      
      return days;
    },
    
    getYear: function () {
      return moment([this.options.year, this.options.month]).format('YYYY');
    },
    
    getMonth: function () {
      return moment([this.options.year, this.options.month]).format('MMMM');
    },
    
    changeMonth: function (months) {
      var month = moment([this.options.year, this.options.month]).add('months', months);
      this.options.year = month.year();
      this.options.month = month.month();
      this.render();
    },
    
    getCalendar: function () {
      return CalendarTpl({ month: this.getMonth(), year: this.getYear(), days: this.getDaysInMonth(), date: this.options.date });
    },
    
    preRender: function () {
      this.context.calendar = this.getCalendar();
      this.context.month = this.getMonth();
      this.context.year = this.getYear();
      this.context.date = this.options.date;
    },
    
    processClick: function (ev) {
      var $target = $(ev.currentTarget);
      
      if ($target.data('toggle') === 'prev-month') {
        this.changeMonth(-1);
      } else if ($target.data('toggle') === 'next-month') {
        this.changeMonth(1);
      } else if ($target.data('toggle') === 'set-day') {
        var date = this.options.date;

        date
          .year($target.data('year'))
          .month($target.data('month'))
          .date($target.data('date'));
        
        this.$('td').removeClass('active');
        $target.addClass('active');
        this.onDateChange(date);
      }
    },
    
    processHours: function (ev) {
      var $target = $(ev.currentTarget);
      
      if ($target.attr('name') === 'hours') this.options.date.hours($target.val());
      if ($target.attr('name') === 'minutes') this.options.date.minutes($target.val());
      
      this.onTimeChange(this.options.date);
    },
    
    onTimeChange: function (date) {
      this.$input_el.val(date.format(settings.DATE_DISPLAY));
      this.trigger('onTimeChange', date);
    },
    
    onDateChange: function (date) {
      this.$input_el.val(date.format(settings.DATE_DISPLAY));
      this.trigger('onDateChange', date);
    },
    
    toggle: function (e) {
      if (this.$el.hasClass('hide')) {
        this.show(e);
      } else {
        this.hide();
      }
    },
    
    show: function (e) {
      var $target = $(e.currentTarget),
          top     = $target.offset().top + $target.height() + 10,
          left    = $target.offset().left;
          
      this.$input_el = $target.children('input');
      
      this.render();
      
      this.$el
        .css('top', top)
        .css('left', left)
        .removeClass('hide');

      e.preventDefault();

      $('html').on('click.datepickeroutside', $.proxy(function (e) { 
        if (e.isDefaultPrevented()) return;
        $('html').off('click.dpoutside');
        this.hide(); 
      }, this));

    },
    
    hide: function () {
      this.$el.addClass('hide');
    },
    
    applyDate: function (ev) {
      this.trigger('applyDate', this.options.date);
      this.hide();
    },
    
    setToday: function (ev) {
      this.options.date = moment().add('days', -1);
      this.onDateChange(this.options.date);
      this.trigger('setToday', this.options.date);
      this.applyDate();
      this.hide();
    },
    
    setAll: function (ev) {
      this.options.date = moment([1970,0,1]);
      this.onDateChange(this.options.date);
      this.trigger('setAll', this.options.date);
      this.applyDate();
      this.hide();
    },
    
    resetTime: function (ev) {
      this.options.date = moment(this.options.date).hour(0).minute(0).second(0);
      this.$el.find('[name=hours]').val('00');
      this.$el.find('[name=minutes]').val('00');
      this.onTimeChange(this.options.date);
    },
    
    preventDefault: function (ev) {
      ev.preventDefault();
    }
  });
  
  return Datepicker;
});
