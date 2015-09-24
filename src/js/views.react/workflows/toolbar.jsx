define(function (require) {
  var React          = require('react'),
      Workflows      = require('collections/workflows'),
      _              = require('underscore'),
      utils          = require('utils'),
      DatePicker     = require('jsx!views.react/components/datepicker'),
      ExportCSV      = require('jsx!views.react/components/exportcsv'),
      ORDER_STATES   = require('constants/workflow').ORDER_STATES,
      workflowsStore = require('views.react/stores/workflows'),
      Actions        = require('views.react/actions/workflows'),
      classNames     = require('classnames'),
      moment         = require('moment');

  require('backbone');
  require('react.backbone');


  var states = _.pluck(ORDER_STATES, 'name');

  var doAction = function (ids, args) {
      var url = _.result(Workflows.prototype, 'url'),
          action = args.action;

      method = args.method || 'put';
      params = { action: args.action, ids: ids.join(',') };

      if (action == 'show' || action == 'hide') {
        params = { action: 'setDeprecated', ids: ids.join(','), deprecated: (action=='hide') };
      }

      if (method == 'get') {
        $request = $.get(url, params);
      } else if (method == 'put') {
        $request = $.put(url, params);
      } else if (method == 'delete') {
        $request = $.put(url, params);
      }

      Actions.fetch();
  };

  var Filters = React.createClass({
    render: function () {
      var filters = this.props.filters,
          csv_options = {
            data: workflowsStore.getCollection().toJSON(),
            include: _.union(['autostart', 'exec_count', 'workflowid', 'name', 'version'], states),
            export: true
          },
          deprecated      = (filters.deprecated) ? 'icon-flag' : 'icon-flag-alt',
          deprecated_text = (filters.deprecated) ? 'Only visible' : 'Show hidden';

      return (
          <div className="btn-group filters">
            <button className="btn dropdown-toggle" data-toggle="dropdown">
              More <span className="caret"></span>
            </button>
            <div className="dropdown-menu">
              <li><a onClick={ this.props.setDeprecated }><i className={ deprecated }></i> { deprecated_text }</a></li>
              <li><ExportCSV opts={ csv_options } filename="workflows" /></li>
            </div>
          </div>
      );
    }
  });

  var SearchFormView = React.createClass({
    filterChange: function (e) {
      this.props.filterChange({ text: e.target.value });
      e.preventDefault();
    },

    onSubmit: function (e) {
      e.preventDefault();
    },

    render: function () {

      return (
        <form className="form-search" onSubmit={ this.onSubmit }>
          <input type="text" className="search-query appendInputButton" placeholder="Search..." defaultValue={ this.props.filterText } onChange={this.filterChange} />
        </form>
      );
    }
  });

  var DateFilterView = React.createClass({
    onChange: function (e) {
      this.setState({value: e.target.value });
    },

    getInitialState: function () {
      return {
        value: this.props.filters.date,
        datepicker: false
      };
    },

    showDatePicker: function () {
      var show = !this.state.datepicker,
          self = this;

      this.setState({
        datepicker: show
      });
    },

    applyDate: function (date) {
      this.props.setDate(date);
      this.setState({ datepicker: false });
    },

    render: function () {
      var value = this.props.filters.date,
          datepicker = this.state.datepicker ? <DatePicker date={ value } onChange={ this.applyDate } onClose={ this.showDatePicker} /> : '';

      if (moment.isMoment(value)) {
        value = utils.formatDate(value);
      }

      return (
        <div className="btn-group toolbar-filters">
            <form className="form-inline nomargin" action="" onSubmit={ this.props.handleSubmitDate }>
            <div className="input-prepend date dp" onClick={ this.showDatePicker }>
              <span className="add-on"><i className="icon-th"></i></span>
              <input type="text" className="" value={ value } onChange={ this.onChange } style={{ width: '10em' }}/>
            </div>
            <div className="btn-group date-shortcuts">
              <button className="btn" onClick={ this.props.setDate.bind(null, 'all') }>All</button>
              <button className="btn dropdown-toggle" data-toggle="dropdown">
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                <li><a onClick={ this.props.setDate.bind(null, 'all') }>All</a></li>
                <li><a onClick={ this.props.setDate.bind(null, '24h') }>24 h</a></li>
                <li><a onClick={ this.props.setDate.bind(null, 'today') }>Today</a></li>
                <li><a onClick={ this.props.setDate.bind(null, 'now') }>Now</a></li>
              </ul>
            </div>
            </form>
            { datepicker }
        </div>
      );
    }
  });

  var Toolbar = React.createClass({
    propTypes: {
      filterChange: React.PropTypes.func.isRequired,
      filters: React.PropTypes.object,
      actions: React.PropTypes.object.isRequired,
      store: React.PropTypes.object.isRequired,
    },

    componentDidMount: function () {
      var fixed = this.props.fixed;

      if (fixed) {
        var $el = $(this.getDOMNode());
        var $push = $('<div class="push" />').height($el.outerHeight(true));

        $el
          .width(function () { return $(this).width(); })
          .css('position', 'fixed')
          .after($push);

        // bind resize on window size change
/*        $(window).on('resize.toolbar.' + this.cid, $.proxy(this.resize, this));*/
      }

    },

    getInitialState: function () {
      return {
        filters: this.props.filters
      };
    },

    handleSubmitDate: function (e) {
      e.preventDefault();
      this.props.filterChange({ date: this.refs.date.getDOMNode().value.trim() });
    },

    setDeprecated: function (e) {
      e.preventDefault();

      var deprecated = !workflowsStore.state.filters.deprecated;

      this.props.filterChange({ deprecated: deprecated });
    },

    setDate: function (date, e) {

      if (e) {
        e.preventDefault();
      }

      if (!moment.isMoment(date)) {
        date = utils.prepareDate(date);
      }

      Actions.filterChange({ date: date });
    },

    render: function () {
      var filters         = workflowsStore.state.filters,
          date            = filters.date,
          clsActions      = classNames({
            "btn-group": true,
            "toolbar-actions": true,
            hide: (this.props.store.state.checkedIds.length === 0)
          }),
          actions = this.props.actions;


      return (
        <div id="workflows-toolbar" className="toolbar">
          <div className="workflows-toolbar btn-toolbar sticky toolbar">
              <div className="btn-group">
                <button className="btn dropdown-toggle" data-toggle="dropdown">
                  <i className="icon-check-empty check-all checker"></i>&nbsp;
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu above">
                  <li><a href="#" className="check-all" onClick={ actions.check.bind(null, 'all') }>All</a></li>
                  <li><a href="#" className="uncheck-all" onClick={ actions.check.bind(null, 'none') }>None</a></li>
                  <li><a href="#" className="invert" onClick={ actions.check.bind(null, 'invert') }>Invert</a></li>
                  <li><a href="#" className="running" onClick={ actions.check.bind(null, function (m) { if (m.get('exec_count') > 0) return m.id; }) }>Running</a></li>
                  <li><a href="#" className="stopped" onClick={ actions.check.bind(null, function (m) { if (m.get('exec_count') === 0) return m.id; }) }>Stopped</a></li>
                </ul>
              </div>
              <div className={ clsActions }>
                <button className="btn" onClick={ actions.run.bind(null, doAction, { action: 'enable' }) }><i className="icon-off"></i> Enable</button>
                <button className="btn" onClick={ actions.run.bind(null, doAction, { action: 'disable' }) }><i className="icon-ban-circle"></i> Disable</button>
                <button className="btn" onClick={ actions.run.bind(null, doAction, { action: 'reset' }) }><i className="icon-refresh"></i> Reset</button>
                <button className="btn" onClick={ actions.run.bind(null, doAction, { action: 'hide' }) }><i className="icon-flag-alt"></i> Hide</button>
                <button className="btn" onClick={ actions.run.bind(null, doAction, { action: 'show' }) }><i className="icon-flag"></i> Show</button>
              </div>
              <DateFilterView filters={ filters } handleSubmitData={ this.handleSubmitData } setDate={ this.setDate } />
              <Filters setDeprecated={ this.setDeprecated } collection={ this.props.store.getCollection() } filters={ filters }/>
              <div className="pull-right">
                <SearchFormView filterText={this.props.filters.text} filterChange={this.props.filterChange}/>
              </div>
              <div id="table-copy" className="btn-group toolbar-filters"></div>
          </div>
          <div className="datepicker-container"></div>
        </div>
      );
    }
  });

  return Toolbar;
});