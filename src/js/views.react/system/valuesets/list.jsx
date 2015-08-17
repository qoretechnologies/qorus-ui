define(function (require) {
  var _               = require('underscore'),
      React           = require('react'),
      Reflux          = require('reflux'),
      ValueSets       = require('collections/valuesets'),
      Table           = require('jsx!views.react/components/table').TableView,
      Td              = require('jsx!views.react/components/table').TdComponent,
      Col             = require('jsx!views.react/components/dummy'),
      Cell            = require('jsx!views.react/components/table').CellView,
      RowViewBase     = require('jsx!views.react/components/table').RowView,
      Loader          = require('jsx!views.react/components/loader'),
      SearchFormView  = require('jsx!views.react/components/search'),
      MetaTable       = require('jsx!views.react/components/metatable'),
      EditableCell    = require('jsx!views.react/components/editablecell'),
      utils           = require('utils'),
      Pane            = require('jsx!views.react/components/pane'),
      StateStoreMixin = require('views.react/stores/mixins/statestore'),
      FilterMixin     = require('cjs!views.react/stores/mixins/filter.mixin'),
      CollectionMixin = require('cjs!views.react/stores/mixins/collection.mixin'),
      SaveFile        = require('jsx!views.react/components/savefile'),
      RestComponent   = require('jsx!views.react/components/rest'),
      SwitchButton    = require('jsx!views.react/components/switch'),
      DetailMixin     = require('cjs!views.react/stores/mixins/detail.mixin'),
      classNames      = require('classnames');

  var Actions = Reflux.createActions(_.union(DetailMixin.actions, CollectionMixin.actions, FilterMixin.actions));

  var Store = Reflux.createStore(_.extend(DetailMixin,{ listenables: [Actions], mixins: [StateStoreMixin, CollectionMixin, FilterMixin]}));

  var ValueSetsActions = Reflux.createActions(_.union([FilterMixin.actions], ['setCollection', 'getValues']));

  var ValueSetsStore = Reflux.createStore({
    mixins: [StateStoreMixin, FilterMixin],
    listenables: [ValueSetsActions],
    getInitialState: function () {
      return this.state;
    },
    onReset: function () {
      this.trigger(this.state);
    },
    onGetValues: function (model) {
      this.onSetCollection(model.get('values'));

      if (!model.get('values')) {
        model.getProperty('values', null, null, function () {
          this.onSetCollection(model.get('values'));
        }.bind(this));
      }
    },
    onSetCollection: function (collection) {
      this.setState({ collection: collection });
    }
  });

  var DeleteCell = React.createClass({
    deleteValue: function () {
      this.props._model.doAction({ action: 'value', key: this.props.model.key, value: '' })
        .done(ValueSetsActions.setCollection(this.props.model.get('values')));
    },

    render: function () {
      return (
        <td><a className="label label-danger" onClick={ this.deleteValue }><i className="icon-trash" /></a></td>
      );
    }
  });

  var OnOff = React.createClass({
    getInitialState: function () {
      return {
        enabled: this.props.model.enabled
      };
    },

    setValue: function (val) {
      var model = this.props._model,
          m = this.props.model;

      m.enabled = val;

      model.doAction(_.extend({ action: 'value' }, m)).done(this.setState({ enabled: val }));
    },

    render: function () {
      return (
        <SwitchButton value={ this.state.enabled } setValue={ this.setValue } />
      );
    }
  });

  var ValuesRowView = React.createClass({
    render: function () {
      var cls = classNames({ disabled: !this.props.model.enabled });

      return (
        <RowView {...this.props} className={ cls } />
      );
    }
  });

  var DetailView = React.createClass({
    mixins: [Reflux.connect(ValueSetsStore)],

    componentWillMount: function () {
      ValueSetsActions.getValues(this.props.model);
    },

    componentWillReceiveProps: function (nextProps) {
      ValueSetsActions.getValues(nextProps.model);
    },

    setValue: function (key, value) {
      this.props.model.doAction({ action: 'value', key: key, value: value }).done(this.render.bind(this));
    },

    setEnabled: function (key, enabled) {
      var value = _.find(this.props.model.get('values'), { key: key }).value;

      this.props.model.doAction({ action: 'value', key: key, value: value, enabled: enabled }).done(this.render.bind(this));
    },

    render: function () {
      var state = this.state, collection = state.collection;

      if (state.filters.text && state.filters.text !== "") {
        collection = collection.filter(function (m) { return m.key.indexOf(state.filters.text) !== -1 || m.value.indexOf(state.filters.text) !== -1; });
      }

      return (
        <Pane idx={ this.props.model.id } model={ this.props.model } onClose={ Actions.showDetail.bind(null, null) } name="valuesets-values">
          <h3>{ this.props.model.get('name') }</h3>
          <Toolbar actions={ ValueSetsActions } className="" />
          <Table collection={ collection } className="table table-striped table-condensed"
            rowView={ ValuesRowView }>
            <Col name="Key" className="name">
              <Cell dataKey="key" className="name" />
            </Col>
            <Col name="Value">
              <EditableCell dataKey="value" _model={ this.props.model } attributeName="key" onSave={ this.setValue } isCell={ true } />
            </Col>
            <Col name="Enabled">
              <OnOff _model={ this.props.model } />
            </Col>
            <Col name="">
              <DeleteCell _model={ this.props.model } />
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
      var props   = this.props,
          clicked = (props.model == Store.state.showDetail);

      return (
        <RowViewBase {...this.props} clicked={ clicked } rowClick={ this.rowClick }/>
      );
    }
  });

  var Toolbar = React.createClass({
    filterChange: function (filter) {
      this.props.actions.filter(filter);
    },

    clearAll: function (e) {
      e.preventDefault();
      this.props.actions.clear(null, null);
    },

    render: function () {
      return (
        <div className="toolbar">
          <div className="btn-group">
            <SearchFormView filterChange={ this.filterChange } classNames={ this.props.classNames }/>
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

    componentWillUnmount: function () {
      Actions.showDetail(null);
    },

    render: function () {
      var state = this.state, table = null, detail = null, toolbar = null,
          models = null,
          size = 0;

      if (state.collection) {
        size = state.collection.size();
        models = state.collection.models;

        if (state.filters.text && state.filters.text !== "") {
          models = state.collection.filter(function (m) { return m.get('name').indexOf(state.filters.text) !== -1; });
        }

        toolbar = <Toolbar actions={ Actions } />;

        table = (
          <Table
            collection={ models }
            className="table table-striped table-condensed"
            rowView={ RowView }>
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
            <Col name="Dump">
              <SaveFile getDump="getDump" />
            </Col>
          </Table>
        );

        if (state.showDetail) {
          detail = <DetailView model={ state.showDetail } />;
        }
      }

      return (
        <RestComponent {...this.state} size={ size }>
          { toolbar }
          { table }
          { detail }
        </RestComponent>
      );
    }
  });

  return List;
});
