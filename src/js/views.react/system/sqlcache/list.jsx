define(function (require) {
  require('sprintf');

  var React           = require('react'),
      Reflux          = require('reflux'),
      _               = require('underscore'),
      SqlCache        = require('models/sqlcache'),
      Table           = require('jsx!views.react/components/table').TableView,
      Col             = require('jsx!views.react/components/dummy'),
      Cell            = require('jsx!views.react/components/table').CellView,
      CheckerBase     = require('jsx!views.react/components/checker'),
      StoreStateMixin = require('views.react/stores/mixins/statestore'),
      SearchFormView  = require('jsx!views.react/components/search'),
      Loader          = require('jsx!views.react/components/loader'),
      List;

  var FETCH_INIT = 0, FETCH_DONE = 1, FETCH_ERROR = 2;

  var Actions = Reflux.createActions(['fetch', 'checkItem', 'clear', 'filter']);

  var Store = Reflux.createStore({
    mixins: [StoreStateMixin],
    listenables: [Actions],

    init: function () {
      this.state = {
        sqlCache: new SqlCache(),
        fetchStatus: FETCH_INIT,
        fetchError: null,
        checkedIds: [],
        filters: null
      };
    },

    getInitialState: function () {
      return this.state;
    },

    onFetch: function () {
      var self = this;

      this.state.sqlCache.fetch()
        .done(function () {
          self.setState({ fetchStatus: FETCH_DONE, sqlCache: self.state.sqlCache });
        })
        .fail(function (resp) {
          var r = resp.responseJSON;
          self.setState({ fetchStatus: FETCH_ERROR, fetchError: sprintf("%s: %s", r.err, r.desc) });
        });
    },

    onClear: function (ds, name) {
      var promise = this.state.sqlCache.doAction({
        action: 'deleteCache',
        datasource: ds,
        name: name
      });

      promise.done(Actions.fetch);
    },

    onCheckItem: function (id) {
      var checkedIds = this.state.checkedIds.slice();

      if (this.isChecked(id)) {
        checkedIds = _.without(checkedIds, id);
      } else {
        checkedIds.push(id);
      }

      this.setState({ checkedIds: checkedIds });
    },

    isChecked: function (id) {
      return _.indexOf(this.state.checkedIds, id) !== -1;
    },

    onCheckAll: function () {
      var ds = this.state.sqlCache.get('datasources'),
          ids = [];

      _.each(ds, function (d) {
        _.each(d.tables, function (table) {
          ids.push(table.name);
        });
      });

      this.setState({ checkedIds: ids });
    },

    onFilter: function (filter) {
      var filters = _.extend({}, this.state.filters, filter);

      this.setState({ filters: filters });
    }
  });


  var Checker = React.createClass({
    mixins: [Reflux.listenTo(Store, 'onStoreChange')],

    getId: function () {
      return this.props.model.name;
    },

    getInitialState: function () {
      return {
        checked: Store.isChecked(this.getId())
      };
    },

    onStoreChange: function () {
      var checked = Store.isChecked(this.getId());

      if (this.state.checked !== checked) {
        this.setState({ checked: checked });
      }
    },

    checkItem: function (model, e) {
      Actions.checkItem(this.props.model.name);
      e.stopPropagation();
    },

    render: function () {
      var checked = Store.isChecked(this.props.model.name);

      return <CheckerBase checked={ checked } onClick={ this.checkItem } />;
    }
  });


  var ActionsCell = React.createClass({
    render: function () {
      return (
        <div><a className="btn btn-mini btn-danger" onClick={ Actions.clear.bind(null, this.props.model.datasource, this.props.model.name) }><i className="icon-trash" /> Clear</a> &nbsp;</div>
      );
    }
  });


  var DataSource = React.createClass({
    mixins: [Reflux.connect(Store)],

    render: function () {
      var tables = this.props.collection,
          filters = Store.state.filters;

      if (filters && filters.text) {
        tables = _.filter(tables, function (t) { return t.name.indexOf(filters.text.toLowerCase()) !== -1; });
      }

      return (
        <div>
          <h4>{ this.props.name }</h4>
          <Table collection={ tables } className="table table-striped table-condensed">
            <Col name="Name" className="name">
              <Cell dataKey='name' className="name" />
            </Col>
            <Col name="Count">
              <Cell dataKey='count' />
            </Col>
            <Col name="Created">
              <Cell dataKey='created' />
            </Col>
            <Col>
              <ActionsCell className="text-right" />
            </Col>
          </Table>
        </div>
      );
    }
  });

  var Toolbar = React.createClass({
    filterChange: function (filter) {
      Actions.filter(filter);
    },

    clearAll: function (e) {
      e.preventDefault();
      Actions.clear(null, null);
    },

    render: function () {
      return (
        <div className="toolbar">
          <div className="btn-group">
            <button className="btn btn-small" onClick={ this.clearAll }><i className="icon-trash" /> Clear all</button>
          </div>
          <div className="btn-group pull-right">
            <SearchFormView filterChange={ this.filterChange } />
          </div>
        </div>
      );
    }
  });


  List = React.createClass({
    mixins: [Reflux.connect(Store)],

    componentDidMount: function () {
      Actions.fetch();
    },

    render: function () {
      var datasources = <Loader />,
          toolbar     = null,
          state       = this.state;

      if (state.fetchStatus === FETCH_DONE) {
        if (_.size(state.sqlCache.get('datasources')) > 0) {
          datasources = _.map(state.sqlCache.get('datasources'), function (ds) {
            return <DataSource collection={ ds.tables } name={ ds.name } checkedIds={ state.checkedIds } key={ ds.name } />;
          });

          toolbar = <Toolbar />;
        } else {
          datasources = <p>No data found for SQL cache tables</p>;
        }
      } else if (state.fetchStatus === FETCH_ERROR) {
        datasources = (
          <div className="alert alert-warning">
            <h4>Failed to fetch SQL cache!</h4>
            <p>{ state.fetchError }</p>
            <p><button className="btn btn-small btn-success" onClick={ Actions.fetch }><i className="icon-refresh" /> Retry</button></p>
          </div>
        );
      }

      return (
        <div>
          { toolbar }
          { datasources }
        </div>
      );
    }
  });

  return List;
});


/*

<Col key="checker" className="narrow">
  <Checker checkedIds={ this.props.checkedIds }/>
</Col>

*/
