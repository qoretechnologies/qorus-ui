define(function (require) {
  var _               = require('underscore'),
      React           = require('react'),
      Reflux          = require('reflux'),
      ValueSets       = require('collections/valuesets'),
      Table           = require('jsx!views.react/components/table').TableView,
      Col             = require('jsx!views.react/components/dummy'),
      Cell            = require('jsx!views.react/components/table').CellView,
      RowViewBase     = require('jsx!views.react/components/table').RowView,
      Loader          = require('jsx!views.react/components/loader'),
      SearchFormView  = require('jsx!views.react/components/search'),
      StoreStateMixin = require('views.react/stores/mixins/statestore'),
      MetaTable       = require('jsx!views.react/components/metatable'),
      EditableCell    = require('jsx!views.react/components/editablecell'),
      utils           = require('utils'),
      Pane            = require('jsx!views.react/components/pane'),
      FilterMixin     = require('cjs!views.react/stores/mixins/filter.mixin'),
      CollectionMixin = require('cjs!views.react/stores/mixins/collection.mixin'),
      FETCH           = require('cjs!constants/fetch');

  var Actions = Reflux.createActions(_.union(['showDetail', 'getValues'], CollectionMixin.actions, FilterMixin.actions));

  var Store = Reflux.createStore({
    listenables: [Actions],
    mixins: [StoreStateMixin, CollectionMixin, FilterMixin],

    init: function () {
      this.state = _.extend({}, this.state, { showDetail: null, detailValues: false });
    },

    getInitialState: function () {
      return this.state;
    },

    onShowDetail: function (model) {
      var self = this;

      if (!model) {
        this.setState({ showDetail: null, detailValues: false });
      } else if (this.state.showDetail && this.state.showDetail.id === model.id) {
        this.setState({ showDetail: null, detailValues: false });
      } else {
        var values = model.has('values');

        this.setState({ showDetail: model, detailValues: values });

        if (!values) {
          model.getProperty('values', null, null, function () {
            self.setState({ showDetail: model, detailValues: true });
          });
        }
      }
    }
  });

  var DetailView = React.createClass({
    setValue: function (key, value) {
      this.props.model.doAction({ action: 'value', key: key, value: value }).done(this.render.bind(this));
    },

    setEnabled: function (key, enabled) {
      var value = _.find(this.props.model.get('values'), { key: key }).value;

      this.props.model.doAction({ action: 'value', key: key, value: value, enabled: enabled }).done(this.render.bind(this));
    },

    render: function () {
      return (
        <Pane idx={ this.props.model.id } model={ this.props.model } onClose={ Actions.showDetail.bind(null, null) } name="valuesets-values">
          <h3>{ this.props.model.get('name') }</h3>
          <Table collection={ this.props.model.get('values') } className="table table-striped table-condensed">
            <Col name="Key" className="name">
              <Cell dataKey="key" className="name" />
            </Col>
            <Col name="Value">
              <EditableCell dataKey="value" _model={ this.props.model } attributeName="key" onSave={ this.setValue } isCell={ true } />
            </Col>
            <Col name="Enabled">
              <EditableCell dataKey="enabled" _model={ this.props.model } attributeName="key" onSave={ this.setEnabled } isCell={ true } />
            </Col>
          </Table>
        </Pane>
      );
    }
  });

  var RowView = React.createClass({
    rowClick: utils.preventOnSelection(function (model, ev) {
      Actions.showDetail(this.props.model);
    }),

    render: function () {
      return (
        <RowViewBase {...this.props} rowClick={ this.rowClick }/>
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
            <SearchFormView filterChange={ this.filterChange }/>
          </div>
        </div>
      );
    }
  });

  var List = React.createClass({
    mixins: [Reflux.connect(Store)],

    componentDidMount: function () {
      Actions.initCollection(new ValueSets());
      Actions.fetch();
    },

    render: function () {
      var state = this.state, table = null, detail = null, toolbar = null,
          models = null;



      if (state.fetchStatus == FETCH.DONE) {
        models = state.collection.models;

        if (state.filters.text && state.filters.text !== "") {
          models = state.collection.filter(function (m) { return m.get('name').indexOf(state.filters.text) !== -1; });
        }

        table = (
          <Table
            collection={ models}
            className="table table-striped table-condensed"
            rowView={ RowView }
            >
            <Col className="name" name="Name">
              <Cell className="name" dataKey="name" />
            </Col>
            <Col className="description" name="Description">
              <Cell className="description" dataKey="description" />
            </Col>
            <Col name="Author">
              <Cell dataKey="author" />
            </Col>
            <Col name="Type">
              <Cell dataKey="valuetype" />
            </Col>
            <Col name="Size">
              <Cell dataKey="setsize" />
            </Col>
            <Col name="Created">
              <Cell dataKey="created" />
            </Col>
            <Col name="Modified">
              <Cell dataKey="modified" />
            </Col>
          </Table>
        );
        toolbar = <Toolbar />;
      } else if (state.fetchStatus === FETCH.INIT) {
        table = <Loader />;
      } else if (state.fetchStatus === FETCH.ERROR) {
        table = (
          <div className="alert alert-warning">
            <h4>Failed to fetch SQL cache!</h4>
            <p>{ state.fetchError }</p>
            <p><button className="btn btn-small btn-success" onClick={ Actions.fetch }><i className="icon-refresh" /> Retry</button></p>
          </div>
        );
      }

      if (state.showDetail) {
        detail = <DetailView model={ state.showDetail } />;
      }

      return (
        <div>
          { toolbar }
          { table }
          { detail }
        </div>
      );
    }
  });

  return List;
});
