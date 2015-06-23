define(function (require) {
  var React           = require('react'),
      Reflux          = require('reflux'),
      ValueSets       = require('collections/valuesets'),
      Table           = require('jsx!views.react/components/table').TableView,
      Col             = require('jsx!views.react/components/dummy'),
      Cell            = require('jsx!views.react/components/table').CellView,
      RowViewBase    = require('jsx!views.react/components/table').RowView,
      Loader          = require('jsx!views.react/components/loader'),
      StoreStateMixin = require('views.react/stores/mixins/statestore');

  var FETCH_INIT = 0, FETCH_DONE = 1, FETCH_ERROR = 2;


  var CollectionMixin = {
    init: function () {
      this.state = _.extend({}, this.state, {
        collection: null,
        fetchStatus: FETCH_INIT,
        fetchError: null
      });
    },

    onInitCollection: function (collection) {
      this.setState({ collection: collection });
    },

    onFetch: function () {
      var self = this;

      if (this.state.collection) {
        this.state.collection.fetch()
          .done(function () {
            self.setState({ fetchStatus: FETCH_DONE, collection: self.state.collection });
          })
          .fail(function (resp) {
            var r = resp.responseJSON;
            self.setState({ fetchStatus: FETCH_ERROR, fetchError: sprintf("%s: %s", r.err, r.desc) });
          });
      }
    },
  };

  var CollectionActions = Reflux.createActions(['initCollection', 'fetch']);
  var Actions = Reflux.createActions(['showDetail']);

  var Store = Reflux.createStore({
    listenables: [CollectionActions, Actions],
    mixins: [StoreStateMixin, CollectionMixin],

    init: function () {
      this.state = _.extend({}, this.state);
    },

    getInitialState: function () {
      return this.state;
    },

    onShowDetail: function (model) {
      if (this.state.showDetail === model) {
        this.setState({ showDetail: null });
      } else {
        this.setState({ showDetail: model });
      }
    }
  });

  var RowView = React.createClass({
    rowClick: function (model) {
      Actions.showDetail(this.props.model.name);
    },

    render: function () {
      return (
        <RowViewBase {...this.props} rowClick={ this.rowClick }/>
      );
    }
  });

  var List = React.createClass({
    mixins: [Reflux.connect(Store)],

    componentDidMount: function () {
      CollectionActions.initCollection(new ValueSets());
      CollectionActions.fetch();
    },

    showValues: function (model) {
      Actions.showDetail(model);
    },

    render: function () {
      var state = this.state;

      if (state.fetchStatus == FETCH_DONE) {
        table = (
          <Table
            collection={ state.collection.toJSON() }
            className="table table-striped table-condensed"
            rowClick={ this.showValues }
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
      } else if (state.fetchStatus === FETCH_INIT) {
        table = <Loader />;
      } else if (state.fetchStatus === FETCH_ERROR) {
        table = (
          <div className="alert alert-warning">
            <h4>Failed to fetch SQL cache!</h4>
            <p>{ state.fetchError }</p>
            <p><button className="btn btn-small btn-success" onClick={ Actions.fetch }><i className="icon-refresh" /> Retry</button></p>
          </div>
        );
      }

      return (
        <div>
          { table }
        </div>
      );
    }
  });

  return List;
});
