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
      'click [data-toggle]': 'processClick'
    },
    
    tagName: 'div',
    className: "datepicker hide",
    template: Template,
    initialize: function (options) {
      this.options = options || {};
      
      if (!('date' in this.options)) {
        this.options.date = moment();
      } else {
        if (!this.options.date._isMomentObject) {
          this.options.date = moment(this.options.date);
        }
      }
      this.options.month = this.options.date.month();
      this.options.year = this.options.date.year();
      
      this.$input_el = $(this.options.element + ' input');
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
      return CalendarTpl({ month: this.getMonth(), days: this.getDaysInMonth() });
    },
    
    preRender: function () {
      this.context.calendar = this.getCalendar();
      this.context.month = this.getMonth();
    },
    
    onRender: function () {
      var $el = $(this.options.element);
      this.$el
        .css('top', $el.offset().top)
        .css('left', $el.offset().left)
    },
    
    processClick: function (ev) {
      var $target = $(ev.currentTarget);
      
      if ($target.data('toggle') === 'prev-month') {
        this.changeMonth(-1);
      } else if ($target.data('toggle') === 'next-month') {
        this.changeMonth(1);
      } else if ($target.data('toggle') === 'set-day') {
        var date = this.options.date;
        
        console.log(date);

        date
          .year($target.data('year'))
          .month($target.data('month'))
          .date($target.data('date'));
        
        this.$('td').removeClass('active');
        $target.addClass('active');
        this.onDateChange(date);
      }
    },
    
    onDateChange: function (date) {
      this.$input_el.val(date.format(settings.DATE_DISPLAY));
      this.trigger('onDateChange', date);
    }
  });
  
  return Datepicker;
});
