define(function (require) {
  var React     = require('react'),
      _         = require('underscore'),
      PropTypes = React.PropTypes,
      moment    = require('moment'),
      $         = require('jquery'),
      Actions   = require('views.react/actions/date'),
      Calendar, DatePicker;
      
  _.mixin({
    chunk: function(array, unit) {
      var result;
      result = _.groupBy(array, function(element, index) {
        return Math.floor(index / unit);
      });
      
      return _.toArray(result);
    }
  });
      
  Calendar = React.createClass({
    propTypes: {
      date: PropTypes.object.isRequired,
      setDate: PropTypes.func.isRequired
    },
  
    getDaysOfMonth: function () {
      var month = this.props.date.month(),
          year  = this.props.date.year(),
          start = moment([year, month]).startOf('isoweek'),
          end   = start.clone().add('weeks', 6).add('days', -1),
          days  = [],
          date  = this.props.date;
          
      
      while (start.valueOf() <= end.valueOf()) {
        var day = { date: moment(start), day: start.date(), month: start.month(), year: start.year(), css: '' };
        
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
    
    setDate: function (date) {
      this.props.setDate(date);
    },
  
    render: function () {
      var year  = this.props.date.year(),
          month = this.props.date.format('MMM'),
          weeks = _.chunk(this.getDaysOfMonth(), 7),
          rows  = [];
      
      rows = _.map(weeks, function (week, rowidx) { 
        var days = _.map(week, function (day, idx) {
          return (
            <td className={ day.css } key={ idx } onClick={ this.setDate.bind(null, day.date) }>{ day.day }</td>
          );
        }, this);
        
        return (
          <tr key={ rowidx }>{ days }</tr>
        );
      }, this);
      
      return (
        <table className="table table-condensed">
          <thead>
            <tr>
              <th data-toggle="prev-month"><i className="icon-chevron-left"></i></th>
              <th colSpan="5">{ month } { year }</th>
              <th data-toggle="next-month"><i className="icon-chevron-right"></i></th>
            </tr>
            <tr>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
              <th>Sun</th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </table>
      );
    }
  });
  
  DatePicker = React.createClass({
    componentDidMount: function () {
      var $el = $(this.getDOMNode());
      
      $el.css('top', $el.parent().height() + 10);
    },
  
    getInitialState: function () {
      var date = moment.isMoment(this.props.date) ? this.props.date : moment(this.props.date);
    
      return {
        date: date
      };
    },
  
    render: function () {
      var date = this.state.date;
    
      return (
        <div className="datepicker">
          <div className="calendar">
            <Calendar date={ this.state.date } setDate={ this.setDate } />
          </div>
          <div className="hours row-fluid">
            <span className="text-center span2"><i className="icon-time"></i></span>
            <span className="span3"><input type="number" name="hours" max="23" min="0" value={ date.hours() } className="span12 text-center" /></span>
            <span className="span2 text-center">:</span>
            <span className="span3"><input type="number" name="minutes" max="59" min="0" value={ date.minutes() } className="span12 text-center" /></span>
            <span className="span2"><a className="reset-time" onClick={ this.resetTime }><i className="icon-trash text-error"></i></a></span>
          </div>
          <div className="buttons">
            <div className="btn-group">
              <button className="btn" onClick={ this.setDate.bind(null, '24h') }>24 h</button>
              <button className="btn" onClick={ this.setDate.bind(null, 'all') }>All</button>
            </div>
            <button className="btn btn-primary pull-right" onClick={ this.applyDate }>Apply</button>
          </div>
        </div>
      );
    },
    
    setDate: function (date) {
      this.setState({
        date: date
      });
    },
    
    applyDate: function () {
      Actions.setDate(this.state.date);
      this._remove();
    },
    
    resetTime: function () {
      var date = this.state.date;
      
      this.setState({
        date: date
      });
    }
  });


  return DatePicker;
});