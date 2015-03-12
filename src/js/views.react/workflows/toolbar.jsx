define(function (require) {
  var React     = require('react'),
      Workflows = require('collections/workflows'),
      _         = require('underscore');
  
  require('backbone');
  require('react.backbone');
  
  var SearchFormView = React.createClass({
    filterChange: function (e) {
      this.props.filterChange({ text: e.target.value });
    },
    
    render: function () {
      
      return (
        <form className="form-search">
          <div className="input-append search-box">
            <input type="text" className="search-query appendInputButton" placeholder="Search..." defaultValue={ this.props.filterText } onChange={this.filterChange} />
            <button type="submit" className="btn">&nbsp;<i className="icon-search"></i></button>
          </div>
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
        value: this.props.filters.date
      };
    },
    
    render: function () {
      var value = this.state.value || this.props.filters.date;
      
      return (
        <div className="btn-group toolbar-filters">
            <form className="form-inline nomargin" action="" onSubmit={this.props.handleSubmitDate}>
            <div className="input-prepend date dp">
              <span className="add-on"><i className="icon-th"></i></span>
              <input type="text" className="" value={ value } onChange={ this.onChange }/>
            </div>
            <div className="btn-group">
              <button className="btn" data-action="open" data-url="/workflows/all">All</button>
              <button className="btn" data-action="open" data-url="/workflows">24 h</button>
            </div>
            </form>
        </div>
      );
    }
  });

  var Toolbar = React.createClass({
    propTypes: {
      onFilterChange: React.PropTypes.func.isRequired,
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
  
    getCollection: function () {
      return this.props.collection;
    },
    
    getInitialState: function () {
      return {
        filters: this.props.filters
      };
    },
    
    handleSubmitDate: function (e) {
      e.preventDefault();
      if (this.props.actions) {
        this.props.onFilterChange({ date: this.refs.date.getDOMNode().value.trim() });
      }
    },
    
    render: function () {
      var deprecated      = "icon-" + (this.state.filters.deprecated) ? 'flag' : 'flag-alt';
      var deprecated_text = (this.state.filters.deprecated) ? 'Only visible' : 'Show hidden';
      var date = this.state.filters.date,
          clsActions = React.addons.classSet({
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
                  <i className="icon-check-empty check-all checker"></i>
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
                <button className="btn" onClick={ actions.run.bind(null, 'enable') }><i className="icon-off"></i> Enable</button>
                <button className="btn" onClick={ actions.run.bind(null, 'disable') }><i className="icon-ban-circle"></i> Disable</button>
                <button className="btn" onClick={ actions.run.bind(null, 'reset') }><i className="icon-refresh"></i> Reset</button>
                <button className="btn" onClick={ actions.run.bind(null, 'hide') }><i className="icon-flag-alt"></i> Hide</button>
                <button className="btn" onClick={ actions.run.bind(null, 'show') }><i className="icon-flag"></i> Show</button>
              </div>
              <DateFilterView filters={ this.props.filters } handleSubmitData={ this.handleSubmitData } />
              <div className="btn-group toolbar-filters">
                  <button className="btn" data-action="open" data-url="<%= url %>"><i className={ deprecated }></i> { deprecated_text }</button>
              </div>
              <div className="pull-right">
                <SearchFormView filterText={this.props.filters.text} filterChange={this.props.onFilterChange}/>
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