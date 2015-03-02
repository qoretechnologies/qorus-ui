define(function (require) {
  var React             = require('react'),
      Reflux            = require('reflux'),
      _                 = require('underscore'),
      $ = require('jquery'),
      Backbone          = require('backbone'),
      slugify           = require('qorus/helpers').slugify,
      PaneView          = require('jsx!views.react/components/pane'),
      TabsView          = require('jsx!views.react/components/tabs').TabsView,
      Tab               = require('jsx!views.react/components/tabs').Tab,
      ControlsView      = require('jsx!views.react/components/controls').ControlsView,
      TableView         = require('jsx!views.react/components/table').TableView,
      Cell              = require('jsx!views.react/components/table').CellView,
      Col               = require('jsx!views.react/components/dummy'),
      AutostartView     = require('jsx!views.react/workflows/autostart'),
      GroupsView        = require('jsx!views.react/components/groups'),
      OptionsView       = require('jsx!views.react/components/options'),
      LibraryView       = require('jsx!views.react/components/library'),
      DiagramView       = require('jsx!views.react/components/diagram'),
      LogView           = require('jsx!views.react/components/log'),
      StatusIcon        = require('jsx!views.react/components/statusicon'),
      Controls          = require('jsx!views.react/components/controls').ControlsView,
      ModalView         = require('jsx!views.react/components/modal'),
      
      Actions           = require('views.react/actions/tabs'),
      Store             = require('views.react/stores/tabs'),
      LogStore          = require('views.react/stores/log'),
      LogActions        = require('views.react/actions/log'),
      ViewHeightMixin   = require('views.react/mixins/view.height'),
      ModelRenderMixin  = require('views.react/mixins/modelrender'),
      
      ErrorsCollection  = require('collections/errors'),
      GlobalErrors      = require('collections/errors-global'),
      Filtered          = require('backbone.filtered.collection'),
      settings          = require('settings'),
      helpers           = require('qorus/helpers');
  
  require('react.backbone');
  
  var NotAvailableView = React.createClass({
    render: function () {
      return (
        <div>{ this.props.text + " - "} Not yet available</div>
      );
    }
  });
  
  
  var InfoView = React.createClass({
    mixins: [ModelRenderMixin],
    render: function () {
      return (
        <div>
          <GroupsView groups={ this.props.model.get('groups') } />
          <OptionsView options={ this.props.model.getOptions() } model={ this.props.model } />
        </div>
      );
    }
  });
  
  var TabUpdateRefluxMixin = {
    componentDidMount: function () {
      this.unsubscribe = this.props.store.listen(this.onTabUpdate);
    },
    componentWillUnmount: function () {
      this.unsubscribe();
    }
  };
  
  var ErrorCell = React.createClass({
    render: function () {
      var model = this.props.model.toJSON();
      
      return <span>{ model.error }<span className="tooltip hide">{ model.description }</span></span>;
    }
  });
  
  var StatusIconContainer = React.createClass({
    render: function () {
      return <StatusIcon value={ this.props.model.get(this.props.dataKey) } />;
    }
  });
  
  var AlertRow = React.createClass({
    render: function () {
      var obj = this.props.model,
          url = helpers.getUrl('showSystem') + "/" + ["alerts", obj.alerttype.toLowerCase(), obj.alertid].join('/');
    
      return (
        <span>
          <a href={ url }>{ obj.alert }</a><br />
          <p>
            { obj.object }<br />
            <small>{ _.escape(obj.reason) }</small>
          </p>
        </span>  
      );
    }
  });
  
  var AlertsTable = React.createClass({
    render: function () {
      return (
        <TableView collection={ this.props.model.get('alerts') }>
          <Col name="">
            <AlertRow />
          </Col>
        </TableView>
      );
    }
  });
  
  var Field = React.createClass({
    getInitialState: function () {
      return {
        value: this.props.value
      };
    },
  
    onChange: function (e) {
      var val = e.target.value;
      
      this.setState({
        value: val
      });
    },
  
    render: function () {
      var View, 
          props = {
            id: this.props.attrName,
            value: this.state.value,
            onChange: this.onChange
          };
      
      switch (this.props.type) {
        case "string":
          View = <input type="text" {...props} />;
          break;
        case "bool":
          View = <input type="checkbox" checked={ this.state.value } {...props} />;
          break;
        case "text":
          View = <textarea {...props} />;
          break;
      }
    
      return (
        <div className="control-group">
          <label className="control-label" htmlFor={ this.props.attrName }>{ this.props.name }</label>
          <div className="controls">
            { View }
          </div>
        </div>
      );
    }
  });
  
  var ErrorForm = React.createClass({
    render: function () {
      var state = this.state,
          model = this.props.model,
          fieldsMap = [
            {
              name: 'Error',
              attrName: 'error',
              required: true,
              readonly: true,
              type: 'string'
            },
            {
              name: 'Severity',
              attrName: 'severity',
              required: true,
              type: 'string'
            },
            {
              name: 'Retry',
              attrName: 'retry_flag',
              type: 'bool'
            },
            {
              name: 'Retry delay secs',
              attrName: 'retry_delay_secs',
              type: 'string'
            },
            {
              name: 'Business',
              attrName: 'business_flag',
              type: 'bool'
            },
            {
              name: 'Manually updated',
              attrName: 'manually_updated',
              type: 'bool'
            },
            {
              name: 'Description',
              attrName: 'description',
              required: true,
              type: 'text'
            }
          ];
      
      
      var fields = _.map(fieldsMap, function (field) {
        return <Field {...field} value={ model.get(field.attrName) } />;
      });
    
      return (
        <form className="form-horizontal" id="error-edit-form">
          { fields }
        </form>
      );
    }
  });
  
  var ErrorControlsView = React.createClass({
    propTypes: {
      control: React.PropTypes.object.isRequired
    },
    
    onClick: function (e) {
      var control = this.props.control;
    
      e.stopPropagation();
      e.preventDefault();

      if (control.action == 'edit') {
        this.showModal();
      } else if (control.action == 'clone') {
        this.showCloneModal();
      } else {
        this.props.model.doAction(control.action);
      }
    },
  
    render: function () {      
      var control  = this.props.control,
          cls      = "label label-" + control.css,
          icon_cls = "icon-" + control.icon;
      
      return (
        <a className={cls} title={control.title} onClick={this.onClick}><i className={icon_cls} /></a>
      );
    },
       
    showModal: function () {
      var modal = <ModalView title={ this.props.control.action + " " + this.props.model.get('error') }><ErrorForm model={ this.props.model } /></ModalView>;
      var el = $('<div class="modal-container" />').appendTo('body');
      React.render(modal, el[0]);
    },
    
    showCloneModal: function () {
      this.showModal();
    }
  });
  
  var ErrorsTable = React.createBackboneClass({
    getInitialState: function () {
      return {
        fetched: this.props.collection.size() > 0,
        search_text: '',
        modelId: this.props.model
      };
    },
    
    onSearch: function (e) {
      this.setState({
        search_text: e.target.value
      });
    },
    
    componentDidMount: function () {
      this._fetch();
    },
    
    componentDidUpdate: function () {
      if (this.state.modelId !== this.props.modelId) {
        this._fetch(true);
      }
    },
    
    _fetch: function (force) {
      if (this.isMounted()) {
        var self = this,
            isBackbone = this.props.collection instanceof Backbone.Collection;

        if ((!this.state.fetched || force) && isBackbone) {
          this.props.collection.fetch({
            success: function () {
              self.setState({ 
                fetched: true,
                search_text: '',
                modelId: self.props.modelId
              });
            }
          });
        }
      }
    },
  
    render: function () {
      var col     = new Filtered(this.props.collection),
          search  = this.state.search_text;
      
      if (search) {
        col.filterBy(function (m) {
          return m.get('error').toLowerCase().indexOf(search) !== -1;
        });
      }
    
      return (
        <div className="relative">
          <h4>{ this.props.name }</h4>
          <div className="pull-right">
            <form className="form-search form-small">
              <div className="input-append search-box">
                <input type="text" className="search-query appendInputButton" placeholder="Search..." value={ this.state.search_text } onChange={ this.onSearch } />
                <button type="submit" className="btn">&nbsp;<i className="icon-search"></i></button>
              </div>
            </form>
          </div>
          <TableView collection={ col } collection_fetched={ this.state.fetched } className="table table-striped table-condensed">
            <Col name="Name" className="name">
              <ErrorCell className="name" />
            </Col>
            <Col name="Severity">
              <Cell dataKey="severity" />
            </Col>
            <Col name="Retry">
              <StatusIconContainer dataKey="retry" />
            </Col>
            <Col name="Delay">
              <Cell dataKey="retry_delay_secs" />
            </Col>
            <Col name="Business">
              <StatusIconContainer dataKey="business_flag" />
            </Col>
            <Col>
              <Controls model={ this.props.model } controlView={ ErrorControlsView } />
            </Col>
          </TableView>
        </div>
      );
    }
  });
  
  var ErrorsContainer = React.createClass({
    getInitialState: function () {
      return this.getInitialCollections();
    },
  
    // set initial collection maybe it would be better via store
    getInitialCollections: function (id) {
      var errors = new ErrorsCollection([], { workflowid: id || this.props.model.id }),
          global = new Filtered(GlobalErrors);
          
      global.listenTo(errors, 'sync add destroy', function (model, collection) {
        var names;
        
        if (model instanceof Backbone.Collection) {
          collection = model;
        }
        
        if (collection instanceof Backbone.Model) {
          names = [collection.get('error')];
        } else {
          names = collection.pluck('error');
        }
        
        this.filterBy('error', function (model) {
          return _.indexOf(names, model.get('error')) === -1;
        });
      });
    
      return {
        errors_collection: errors,
        global_collection: global
      };
    },
    
    componentWillReceiveProps: function (nextProps) {
      this.setState(this.getInitialCollections(nextProps.model.id));
    },
    
    render: function () {
      
      return (
        <div>
          <ErrorsTable collection={ this.state.errors_collection } name="Workflow definitions" modelId={this.props.model.id} />
          <ErrorsTable collection={ this.state.global_collection } name="Global definitions" modelId={this.props.model.id} />
        </div>
      );
    }
  });
  
  var LogViewContainer = React.createBackboneClass({
    mixins: [ViewHeightMixin, TabUpdateRefluxMixin],
    
    getInitialState: function () {
      return {
        rows: [],
        scroll: true,
        pause: false
      };
    },
    
    _connect: function (props) {
      // close websocket connection if already connected
      if (this.actions) {
        this.actions.close();
      }
    
      var url = [settings.WS_HOST, 'log', 'workflows', props.model.id].join('/');
      
      this.actions = new LogActions();
      this.store = new LogStore(this.actions);
      
      this.store.listen(this.onStoreUpdate);
      
      this.actions.connect(url);
    },
    
    componentWillMount: function () {
      this._connect(this.props);
    },
    
    onTabUpdate: function (state) {
      if (state.active_index == this.props.idx) {
        _.defer(this._setHeight);
      }
    },
    
    componentWillReceiveProps: function (nextProps) {
      this._connect(nextProps);
    },
    
    componentWillUnmount: function () {
      this.actions.close();
    },
    
    onStoreUpdate: function (st) {
      this.setState(st);
    },
  
    render: function () {
      var cls1 = React.addons.classSet({
        btn: true,
        'btn-small': true,
        'btn-success': this.store.state.scroll
      });
      
      var cls2 = React.addons.classSet({
        btn: true,
        'btn-small': true,
        'btn-success': this.store.state.pause
      });
    
      return (
        <div style={{ overflow: 'hidden' }}>
          <div>
            <a className={ cls1 } onClick={ this.actions.toggleScroll }><i className="icon-ok" /> Autoscroll</a>
            <a className={ cls2 } onClick={ this.actions.togglePause }><i className="icon-pause" /> Pause</a>
          </div>
          <LogView rows={ this.state.rows } actions={ this.actions } scroll={ this.state.scroll } pause={ this.state.pause } model={ this.props.model.id } />
        </div>
      );
    }
  });
  
  var LibraryViewContainer = React.createClass({
    mixins: [ViewHeightMixin, TabUpdateRefluxMixin],
    onTabUpdate: function (state) {
      if (state.active_index == this.props.idx) {
        _.defer(this._setHeight);
      }
    },
    render: function () {
      return <LibraryView model={ this.props.model } />;
    }
  });
  
  var ContentView = React.createClass({
    render: function () {
      var actions = Actions(),
          store   = Store(actions),
          model   = this.props.model,
          tabs = [
            <Tab name="Detail" key="detail">
              <InfoView model={ model } />
            </Tab>,
            <Tab name="Library" key="library">
              <LibraryViewContainer model={ model } />
            </Tab>,
            <Tab name="Steps" key="steps">
              <DiagramView model={ model } />
            </Tab>,
            <Tab name="Log" key="log">  
              <LogViewContainer model={ model } name="log" />
            </Tab>,
            <Tab name="Errors" key="errors">
              <ErrorsContainer model={ model } />
            </Tab>
          ];
          
      if (model.get('has_alerts')) {
        tabs.push(
          <Tab name="Alerts" key="alerts">
            <AlertsTable model={ model } />
          </Tab>
        );
      }
      
      return (
        <div className="heading">
          <div className="row-fluid relative">
            <h3 className="pull-left"><span className="selectable">{ this.props.model.get('name') }</span> <small>{ this.props.model.get('version') }</small></h3>
            <div className="controls"><ControlsView model={ this.props.model } /> <AutostartView model={ this.props.model } /></div>
            <TabsView store={ store } actions={ actions }>
            { tabs }
            </TabsView>
          </div>
        </div>
      );
    }
  });
  
  var DetailView = React.createClass({
/*
    componentWillReceiveProps: function (nextProps) {
      if (this.props.model.toJSON() !== nextProps.model.toJSON()) {
        
      }
    },
*/
  
    propTypes: {
      model: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onClose: React.PropTypes.func
    },
    
    getInitialState: function () {
      var actions = Actions();
      return {
        store: Store(actions),
        actions: actions
      };
    },
    
    render: function () {
      var pane;
      
      if (this.props.model) {
        pane = <PaneView idx={ this.props.model.id } contentView={ ContentView } model={ this.props.model } onClose={this.props.onClose} name="workflow-meta" />;
      }
      
      return (
        <div id="workflow-detail">
          { pane }
        </div>
      );
    }
  });

  return DetailView;
});