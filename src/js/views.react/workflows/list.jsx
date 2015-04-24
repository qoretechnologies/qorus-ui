/**
 * @jsx React.DOM
 */
define(function (require) {
  var $                   = require('jquery'),
      _                   = require('underscore'),
      React               = require('react'),
      PureRenderMixin     = React.addons.PureRenderMixin,
      Reflux              = require('reflux'),
      utils               = require('utils'),
      FilteredCollection  = require('backbone.filtered.collection'),
      ToolbarView         = require('jsx!views.react/workflows/toolbar'),
      DetailView          = require('jsx!views.react/workflows/detail'),
      BadgeView           = require('jsx!views.react/components/badge'),
      ControlsView        = require('jsx!views.react/components/controls').ControlsView,
      AutostartView       = require('jsx!views.react/workflows/autostart'),
      LoaderView          = require('jsx!views.react/components/loader'),
      TableView           = require('jsx!views.react/components/table').TableView,
      ModelRowView        = require('jsx!views.react/components/table').ModelRowView,
      Cell                = require('jsx!views.react/components/table').CellView,
      CellBackbone        = require('jsx!views.react/components/table').CellBackbone,
      Col                 = require('jsx!views.react/components/dummy'),
      Actions             = require('views.react/actions/workflows'),
      tActions            = require('views.react/workflows/actions/table'),
      tStore              = require('views.react/workflows/stores/table'),
      ViewHeightMixin     = require('views.react/mixins/view.height'),
      helpers             = require('views/workflows/helpers'),
      qHelpers            = require('qorus/helpers'),
      HasAlertsView       = require('jsx!views.react/components/hasalerts'),
      Checker             = require('jsx!views.react/components/checker'),
      workflowsStore      = require('views.react/stores/workflows');
  
//  require('backbone');
  require('react.backbone');
  require('classnames');
  

  var fixed = true;
  
  var store = Reflux.createStore({
    state: {},
    init: function () {
      this.listenTo(tStore, this.setState, this.setState);
      this.listenTo(workflowsStore, this.setState,  this.setState);
    },
    
    updateStore: function (state) {
      this.setState(state);
    },
    
    getState: function () {
      return this.state;
    },
    
    setState: function (state) {
      this.state = _.extend(this.state, state);
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
      return <Checker checked={ this.state.checked } onClick={ this.rowCheck } />;
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
        <a href={ url }>{ this.props.model.get('name') }</a>
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
      <CheckerWrapper />
    </Col>,
    <Col name="Actions" className="actions" key="actions">
      <ControlsView className="connections" />
    </Col>,
    <Col name="Execs" dataSort="exec_count" className="narrow" key="execs">
      <Cell dataKey='exec_count' className="narrow" />
    </Col>,
    <Col name="Autostart" dataSort="autostart" className="autostart narrow" key="autostart">
      <AutostartView className="autostart narrow" />
    </Col>,
    <Col name="ID" dataSort="workflowid" key="workflowid">
      <Cell dataKey="workflowid" className="narrow" />
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
  
  var RowViewWrapper = React.createBackboneClass({
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
            
      if (update !== {}) {
        this.setState(update);
      }
    },
  
    render: function () {
      var cls = classNames({
        warning: this.state.checked,
        info:    this.state.clicked,
      }, 'clickable');
      
      return (
        <ModelRowView {...this.props} className={ cls } hash={ this.props.model.hash } clicked={ this.state.clicked } date={ this.state.date } />
      );
    },
  });
  
  var TableViewWrapper = React.createClass({
    mixins: [ViewHeightMixin, Reflux.listenTo(store, 'onStoreUpdate')],
    
    getInitialState: function () {
      tActions.setCollection(workflowsStore.getCollection());
      
      return {
        hash: utils.hash(store.getCollection()),
        collection_fetched: store.state.collection_fetched,
        error: store.state.error,
        filters: _.extend({}, store.state.filters),
        orderKey: store.state.orderKey,
        order: store.state.order
/*        model: workflowsStore.getModel()*/
      };
    },
    
    rowClick: function (id) {
      tActions.rowClick(id);
    },
    
    sortClick: function (key, ord) {
      tActions.sort(key, ord);
    },
    
    onStoreUpdate: function () {
      var state = _.extend({}, this.state, {          
            hash: utils.hash(store.getCollection()),
            collection_fetched: store.state.collection_fetched,
            error: store.state.error,
            filters: store.state.filters,
            orderKey: store.state.orderKey,
            order: store.state.order
          });
    
      if (!_.isEqual(this.state, state)) {
        this.setState(state);
      }
    },
  
    _update: function () {
      var width = $('#container').width();
      var offSet = 80;
      var height = $(window).height() - offSet;
      
      this.setState({
        tableWidth: width,
        tableHeight: height
      });
    },
  
    render: function () {
      var model       = (this.state.model) ? this.state.model.id : null,
          error       = null,
          tfilter     = workflowsStore.state.filters.text;

      collection = workflowsStore.getCollection();
      
      if (tfilter) {
        collection = collection.filter(function (m) {
          return m.get('name').toLowerCase().indexOf(tfilter.toLowerCase()) != -1 || tfilter == m.id;
        });
      }

      if (this.state.error) {
        error = <div className="alert alert-warning">{ this.state.error }</div>;
      } 
      
      return (
        <div className="overflow-auto-y">
          { error }
          <TableView {...this.state} collection={ collection } current_model={ model } 
            cssClass="table table-striped table-condensed table-hover" 
            rowClick={this.rowClick} rowView={ RowViewWrapper } fixed={ false } chunked={ true } sortClick={ this.sortClick }>
            { columns }
          </TableView>
        </div>
        );
    }
  });

  var ListView = React.createClass({
    componentDidMount: function () {
      Actions.fetch();
    },

    render: function () {
      var detail;

      return  <div id="workflows">
                <ToolbarViewWrapper />
                <TableViewWrapper />
                <DetailViewWrapper />
              </div>;      
    }
  });
  
  return ListView;
});