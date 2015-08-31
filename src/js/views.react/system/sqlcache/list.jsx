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
      FilterMixin     = require('cjs!views.react/stores/mixins/filter.mixin'),
      CollectionMixin = require('cjs!views.react/stores/mixins/collection.mixin'),
      RestComponent   = require('jsx!views.react/components/rest'),
      List;

  var Actions = Reflux.createActions(_.union(['checkItem', 'clear', 'filter'], FilterMixin.actions, CollectionMixin.actions));

  var Store = Reflux.createStore({
    mixins: [StoreStateMixin, CollectionMixin, FilterMixin],
    listenables: [Actions],

    init: function () {
      this.state = {
        checkedIds: [],
      };
    },

    getInitialState: function () {
      return this.state;
    },

    onClear: function (ds, name) {
      var promise = this.state.collection.doAction({
        action: 'clearCache',
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
      var ds = this.state.collection.get('datasources'),
          ids = [];

      _.each(ds, function (d) {
        _.each(d.tables, function (table) {
          ids.push(table.name);
        });
      });

      this.setState({ checkedIds: ids });
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
          <div style={{ marginTop: '10px' }}>
            <div className="span10" style={{ fontSize: '120%', fontWeight: 'bold' }}>{ this.props.name }</div>
            <div className="span2 text-right"><button className="btn btn-danger btn-mini" onClick={ Actions.clear.bind(null, this.props.name, '') }><i className="icon-trash" /> Clear datasource</button></div>
          </div>
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
      Actions.initCollection(new SqlCache());
      Actions.fetch();
    },

    render: function () {
      var toolbar = null,
          state   = this.state,
          size    = 0;

      if (state.collection) {
        size = _.size(state.collection.get('datasources'));
        datasources = _.map(state.collection.get('datasources'), function (ds) {
          return <DataSource collection={ ds.tables } name={ ds.name } checkedIds={ state.checkedIds } key={ ds.name } />;
        });

        toolbar = <Toolbar />;
      }

      return (
        <RestComponent {...this.state} size={ size }>
          { toolbar }
          { datasources }
        </RestComponent>
      );
    }
  });

  return List;
});
