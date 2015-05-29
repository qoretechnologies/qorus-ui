/**
 * @jsx React.DOM
 */
define(function (require) {
  var $                  = require('jquery'),
      _                  = require('underscore'),
      React              = require('react'),
      PureRenderMixin    = React.addons.PureRenderMixin,
      Reflux             = require('reflux'),
      utils              = require('utils'),
      FilteredCollection = require('backbone.filtered.collection'),
      ToolbarView        = require('jsx!views.react/workflows/toolbar'),
      DetailView         = require('jsx!views.react/workflows/detail'),
      BadgeView          = require('jsx!views.react/components/badge'),
      ControlsView       = require('jsx!views.react/components/controls').ControlsView,
      AutostartView      = require('jsx!views.react/workflows/autostart'),
      LoaderView         = require('jsx!views.react/components/loader'),
      TableView          = require('jsx!views.react/components/table').TableView,
      ModelRowView       = require('jsx!views.react/components/table').ModelRowView,
      Cell               = require('jsx!views.react/components/table').CellView,
      CellBackbone       = require('jsx!views.react/components/table').CellBackbone,
      Col                = require('jsx!views.react/components/dummy'),
      Actions            = require('views.react/actions/workflows'),
      tActions           = require('views.react/workflows/actions/table'),
      tStore             = require('views.react/workflows/stores/table'),
      ViewHeightMixin    = require('views.react/mixins/view.height'),
      helpers            = require('views/workflows/helpers'),
      qHelpers           = require('qorus/helpers'),
      HasAlertsView      = require('jsx!views.react/components/hasalerts'),
      Checker            = require('jsx!views.react/components/checker'),
      normalizeWheel     = require('views.react/utils/normalizeWheel'),
      workflowsStore     = require('views.react/stores/workflows'),
      Backbone           = require('backbone');

  Backbone.Obscura   = require('backbone.obscura');

//  require('backbone');
  require('react.backbone');
  require('classnames');

  var FONT_WIDTH = 12 * 0.8;
  var nameWidth = 0;

  var store = Reflux.createStore({
    state: {},

    init: function () {
      this.listenTo(tStore, this.setState);
      this.listenTo(workflowsStore, this.setState);
    },

    updateStore: function (state) {
      this.setState(state);
    },

    getState: function () {
      return this.state;
    },

    setState: function (state) {
      this.state = _.assign(this.state, state);
      this.updateUrl();
      this.trigger(this.state);
    },

    getModel: function () {
      return workflowsStore.getCollection().get(this.state.model);
    },

    getCollection: function () {
      return workflowsStore.getCollection();
    },

    updateUrl: function () {
      if (this.state.filters) {
        var date = utils.encodeDate(this.state.filters.date),
            deprecated = this.state.filters.deprecated;

        var url = qHelpers.getUrl('showWorkflows', {
          date: date,
          deprecated: deprecated ? 'hidden' : ''
        });

        if (this.state.model) {
          if (!deprecated) {
            url += "/";
          }

          url += "/" + this.state.model;
        }

        Backbone.history.navigate(url);
      }
    }
  });

  var CheckerWrapper = React.createClass({
    mixins: [Reflux.listenTo(store, 'onStoreChange')],

    onStoreChange: function () {
      var isChecked = tStore.isRowChecked(this.props.model.id);

      if (this.state.checked !== isChecked){
        this.setState({ checked: isChecked });
      }
    },

    getInitialState: function () {
      var model = this.props.model;
      return {
        checked: tStore.isRowChecked(model.id)
      };
    },

    rowCheck: function (e) {
      e.stopPropagation();
      tActions.rowCheck(this.props.model.id);
    },

    render: function () {
      return (
        <Checker checked={ this.state.checked } onClick={ this.rowCheck } />
      );
    }

  });

  var ToolbarViewWrapper = React.createClass({
    mixins: [Reflux.listenTo(store, 'onStoreUpdate')],

    getInitialState: function () {
      return {
        filters: store.state.filters,
        checkedIds: store.state.checkedIds
      };
    },

    onStoreUpdate: function (state) {
      this.setState({
        filters: store.state.filters,
        checkedIds: store.state.checkedIds
      });
    },

    render: function () {
      if (this.state.filters) {
        return (
          <ToolbarView
            filters={ this.state.filters }
            filterChange={ Actions.filterChange }
            actions={ tActions }
            store={ store }
            fixed={ false } />
        );
      } else {
        return (<div />);
      }

    }
  });

  var LinkView = React.createClass({
    getInitialState: function () {
      return {
        date: store.state.filters.date
      };
    },

    render: function () {
      var model = this.props.model,
          url   = helpers.getUrl(this.props.status, this.props.model.id, store.state.filters.date);

      return (
        <div className="overflow-hidden" style={{ maxWidth: nameWidth }}><a href={ url }>{ this.props.model.get('name') }</a></div>
      );
    }
  });

  var DeprecatedView = React.createClass({
    render: function () {
      var model = this.props.model,
          icon  = model.get('deprecated') ? 'icon-flag-alt' : 'icon-flag';

      return (
        <i className={ icon } />
      );
    }
  });

  var BadgeViewCell = React.createClass({
    shouldComponentUpdate: function (nextProps) {
/*
      console.log('shouldupdate', this.props.model.get(this.props.attr) !== nextProps.model.get(this.props.attr) || (this.props.url !== nextProps.url));
      return this.props.model.get(this.props.attr) !== nextProps.model.get(this.props.attr) || (this.props.url !== nextProps.url);
*/
      return true;
    },

    render: function () {
      var model = this.props.model,
          date  = model.collection.opts.date,
          url   = helpers.getUrl(this.props.attr.toLowerCase(), this.props.model.id, date);

      return (
        <BadgeView val={this.props.model.get(this.props.attr)} url={ url } label={utils.status_map[this.props.attr.toLowerCase()]} />
      );
    }
  });

  var status_cols = [
    ['C','narrow', 'COMPLETE'],
    ['Y','narrow', 'READY'],
    ['S','narrow', 'SCHEDULED'],
    ['N','narrow', 'INCOMPLETE'],
    ['V','narrow', 'EVENT-WAITING'],
    ['A','narrow', 'ASYNC-WAITING'],
    ['W','narrow', 'WAITING'],
    ['R','narrow', 'RETRY'],
    ['E','narrow', 'ERROR'],
    ['I','narrow', 'IN-PROGRESS'],
    ['X','narrow', 'CANCELED'],
    ['B','narrow', 'BLOCKED'],
/*    ['Total','narrow', 'TOTAL'],*/
  ];

  var columns = [
    <Col key="checker">
      <CheckerWrapper style={{ width: FONT_WIDTH*2 + 'px' }} />
    </Col>,
    <Col name="Actions" className="actions" key="actions">
      <ControlsView className="connections" />
    </Col>,
    <Col name="Autostart" dataSort="autostart" className="autostart narrow" key="autostart">
      <AutostartView className="autostart narrow" />
    </Col>,
    <Col name="Execs" dataSort="exec_count" className="narrow" key="execs">
      <Cell dataKey='exec_count' className="narrow" />
    </Col>,
    <Col name="ID" dataSort="workflowid" key="workflowid">
      <Cell dataKey="workflowid" className="narrow" style={{ width: FONT_WIDTH*4 + 'px' }}/>
    </Col>,
    <Col name={ <i className='icon-warning-sign' /> } dataSort="has_alerts" className="narrow" key="has_alerts">
      <HasAlertsView className="narrow" />
    </Col>,
    <Col name="Name" className="name" key="name" dataSort="name">
      <LinkView className='name'/>
    </Col>,
    <Col name="Version" dataSort="version" className="narrow" key="version">
      <Cell dataKey="version" className="narrow"/>
    </Col>
  ];

  columns = columns.concat(status_cols.map(function (col) {
    var [title, css, sort] = col;

    return <Col name={ title } dataSort={ sort } className={ css } key={ sort }>
             <BadgeViewCell attr={ sort } className="err" />
           </Col>;
  }));

  columns = columns.concat([
    <Col name="Total" dataSort="total" className="narrow" key="TOTAL">
      <Cell dataKey="TOTAL" className="narrow" />
    </Col>
  ]);

  var DetailViewWrapper = React.createBackboneClass({
    mixins: [Reflux.listenTo(store, 'onStoreUpdate')],

    getInitialState: function () {
      return {
        model: store.getModel()
      };
    },

    onStoreUpdate: function (ev, model) {
      if (store.getModel()) {
        store.getModel().getSources();
      }

      this.setState({ model: store.getModel() });
    },

    onClose: function () {
      tActions.rowClick(null);
    },

    render: function () {
      if (this.state.model) {
        return (
          <DetailView {...this.props} model={this.state.model} onClose={this.onClose} />
        );
      } else {
        return <div />;
      }
    }
  });

  var RowViewWrapper = React.createClass({
    mixins: [Reflux.listenTo(tStore, 'onStoreUpdate')],
    displayName: 'WorkflowRowView',

    getInitialState: function () {
      return {
        clicked: tStore.isRowClicked(this.props.model.id),
        checked: false,
        date: store.state.filters.date
      };
    },

    onStoreUpdate: function () {
      var id      = this.props.model.id,
          clicked = tStore.isRowClicked(id),
          checked = tStore.isRowChecked(id),
          update  = {};

      if (clicked !== this.state.clicked) {
        update.clicked = clicked;
      }

      if (checked !== this.state.checked) {
        update.checked = checked;
      }

      if (store.state.filters.date !== this.state.date) {
        update.date = store.state.filters.date;
      }

      if (!_.isEmpty(update)) {
        this.setState(update);
      }
    },

    render: function () {
      var cls = classNames({
        warning: this.state.checked,
        info:    this.state.clicked,
      }, 'clickable', this.props.className);

      return (
        <ModelRowView {...this.props} className={ cls } hash={ this.props.model.hash } clicked={ this.state.clicked } date={ this.state.date } />
      );
    },
  });

  var TableViewWrapper = React.createClass({
    mixins: [ViewHeightMixin, Reflux.listenTo(store, 'onStoreUpdate')],

    componentDidMount: function () {
      this.setHeight();
    },

    componentWillReceiveProps: function (nextProps, nextState) {
      this.setHeight(nextState);
    },

    setHeight: function (nextProps, nextState) {
      var state = nextState || this.state,
          props = nextProps || this.props;

      if (this.isMounted()) {
        var el        = this.getDOMNode(),
            height    = $(window).innerHeight() - $(el).position().top - 80 - (2 * this.props.rowHeight),
            maxRows   = Math.floor(height/props.rowHeight),
            maxOffset = (_.size(state.collection) - maxRows) * props.rowHeight;

        this.setState({
          height: height,
          maxRows: maxRows,
          maxOffset: maxOffset,
          shownItems: new Array(maxRows)
        });
      }
    },

    onScroll: function (e) {
      var el         = this.getDOMNode(),
          rowHeight  = this.props.rowHeight,
          maxOffset  = this.state.maxOffset,
          offset     = Math.ceil(Math.max(0, el.scrollTop - rowHeight) / rowHeight),
          step       = Math.floor(this.state.height * 0.5),
          ranges     = {},
          offsetStep = Math.ceil(this.state.maxRows * 0.5) * rowHeight,
          scrollTop  = 0,
          range      = 0;

          for (var size = 0, i = 0; size < maxOffset; i++) {
            ranges[i] = size;
            size += offsetStep;
          }

          range = Math.floor(el.scrollTop/offsetStep);
          scrollTop = ranges[range];

      if (scrollTop != this.state.scrollTop) {
        this.setState({
          scrollTop: offset * rowHeight,
          offset: Math.max(0, Math.ceil(offset) -  Math.ceil(this.state.maxRows * 0.5))
        });
      }
    },

    getFirstRow: function (maxRows) {
      var offset    = this.state.offset,
          rowHeight = this.props.rowHeight;

      return offset;
    },

    getDefaultProps: function () {
      return {
        rowHeight: 21
      };
    },

    getInitialState: function () {
      tActions.setCollection(workflowsStore.getCollection());

      return {
        hash: utils.hash(store.getCollection()),
        collection        : new Backbone.Obscura(workflowsStore.getCollection()),
        collection_fetched: store.state.collection_fetched,
        error: store.state.error,
        filters: _.extend({}, store.state.filters),
        orderKey: store.state.orderKey,
        order: store.state.order,
        height: 0,
        maxRows: 50,
        offset: 0,
        scrollTop: 0,
        maxOffset: 0
      };
    },

    rowClick: function (id) {
      tActions.rowClick(id);
    },

    sortClick: function (key, ord) {
      tActions.sort(key, ord);
    },

    onStoreUpdate: function () {
      var col = store.getCollection(),
          state = _.extend({}, this.state, {
            hash              : utils.hash(col),
            collection_fetched: store.state.collection_fetched,
            collection        : new Backbone.Obscura(workflowsStore.getCollection()),
            error             : store.state.error,
            orderKey          : store.state.orderKey,
            order             : store.state.order,
            maxOffset         : (_.size(col) - this.state.maxRows - 1) * this.props.rowHeight
          });

      if (!_.isEqual(this.state, state)) {
        this.setState(state);
      }
    },

    render: function () {
      var model       = (this.state.model) ? this.state.model.id : null,
          error      = null,
          tfilter    = workflowsStore.state.filters.text,
          deprecated = workflowsStore.state.filters.deprecated,
          tColumns   = columns.slice();

      collection = this.prepareCollection();

      var styleFixed = {
        position: 'absolute',
        top: 0,
        // transform: "translate3d(0,"+this.state.scrollTop+"px,0)",
        width: "calc(100% - 10px)",
        marginTop: this.state.scrollTop
      };

      this.setNameWidth();

      if (deprecated) {
        tColumns.push(
          <Col key="deprecated">
            <DeprecatedView />
          </Col>
        );
      }

      if (this.state.error) {
        error = <div className="alert alert-warning">{ this.state.error }</div>;
      }

      return (
        <div className="overflow-auto-y" style={{ position: 'relative' }} onScroll={ this.onScroll }>
          { error }
          <div className="scroller" style={{ height: (_.size(this.state.collection) + 1) * this.props.rowHeight }} />
          <div className="table-fixed" style={ styleFixed }>
            <TableView {...this.state}
              collection={ collection }
              current_model={ model }
              cssClass="table table-stripes table-condensed table-hover"
              rowClick={ this.rowClick }
              rowView={ RowViewWrapper }
              fixed={ true }
              sortClick={ this.sortClick }
              offset={ this.state.offset }
              shownItems={ Math.ceil(this.state.maxRows * 1.5) }
              scrollTop={ this.state.scrollTop }
              showHeader={ false }>
              { tColumns }
            </TableView>
          </div>
        </div>
        );
    },

    prepareCollection: function () {
      var collection = this.state.collection,
          tfilter    = workflowsStore.state.filters.text,
          deprecated = workflowsStore.state.filters.deprecated,
          firstRow   = 0;

      collection.resetFilters();

      if (tfilter) {
        collection.filterBy('search', function (m) {
          var filters = tfilter.split(','),
              name = m.get('name').toLowerCase();

          _.each(filters, function (f) {

          });

          return m.get('name').toLowerCase().indexOf(tfilter.toLowerCase()) != -1 || tfilter == m.id;
        });
      }

      if (!deprecated) {
        collection.filterBy('deprecated', function (m) {
          return m.get('deprecated') === false;
        });
      }

      return collection;
    },

    setNameWidth: function () {
      nameWidth = 0;

      _(this.state.collection.toJSON()).pluck('name').each(function (wfl) { nameWidth = Math.max(nameWidth, wfl.length); });

      nameWidth *= FONT_WIDTH;
    }
  });

  var ListView = React.createClass({
    componentDidMount: function () {
      Actions.fetch();
    },

    render: function () {
      var detail;

      // <MyFixedTable />
      return  <div id="workflows">
                <ToolbarViewWrapper />
                <TableViewWrapper />
                <DetailViewWrapper />
              </div>;
    }
  });

  return ListView;
});
