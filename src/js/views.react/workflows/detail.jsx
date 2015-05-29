define(function (require) {
  var React             = require('react'),
      Reflux            = require('reflux'),
      _                 = require('underscore'),
      $                 = require('jquery'),
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
      ModalView         = require('jsx!views.react/components/modal').ModalView,
      ModelForm         = require('jsx!views.react/components/form').ModelForm,
      MetaTable         = require('jsx!views.react/components/metatable'),
      MapperList        = require('jsx!views.react/components/mappers/list'),

      Actions           = require('views.react/actions/tabs'),
      Store             = require('views.react/stores/tabs'),
      LogStore          = require('views.react/stores/log'),
      LogActions        = require('views.react/actions/log'),
      ViewHeightMixin   = require('views.react/mixins/view.height'),
      ModelRenderMixin  = require('views.react/mixins/modelrender'),

      FormActions       = require('views.react/actions/form'),
      FormStore         = require('views.react/stores/form'),
      ModalActions      = require('views.react/actions/modal'),

      ErrorModel        = require('models/error'),

      MappersCollection = require('collections/mappers'),
      ErrorsCollection  = require('collections/errors'),
      GlobalErrors      = require('collections/errors-global'),
      Filtered          = require('backbone.filtered.collection'),
      settings          = require('settings'),
      helpers           = require('qorus/helpers'),
      ORDER_STATES      = require('constants/workflow').ORDER_STATES;

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
      var model = this.props.model;

      if (model) {
        return <span>{ model.get('error') }<span className="tooltip hide">{ model.get('description') }</span></span>;
      } else {
        return <span />;
      }
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
            <small>{ obj.reason }</small>
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

  var fields = [
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

  var ErrorForm = React.createClass({
    getDefaultProps: function () {
      var actions = new FormActions();

      return {
        actions: actions,
        store: new FormStore(actions)
      };
    },

    getInitialState: function () {
      return {
        error: null
      };
    },

    componentDidMount: function () {
      this.unsubscribe = this.props.store.listen(this.onStoreChange);
    },

    componentWillUnmount: function () {
      this.unsubscribe();
    },

    onStoreChange: function (state) {
      var model = this.props.model,
          self  = this;

      model.set(state.form);

      model.save(null, {
        success: ModalActions.hide,
        error: function (model, resp) {
/*          console.log(arguments);*/
          self.setState({ error: resp.responseJSON.desc });
        }
      });

      if (!model.collection) {
        this.props.collection.add(model);
      }
    },

    onSave: function (e) {
      var prepared = this.refs.form.prepare();

      this.props.actions.submit(prepared);

      e.preventDefault();
    },

    render: function () {
      var error,
          state = this.props.state,
          model = this.props.model;

      if (this.state.error) {
        error = <p className="alert">{ this.state.error }</p>;
      }

      return (
        <form className="form-horizontal" id="error-edit-form" onSubmit={ this.onSave }>
          { error }
          <ModelForm model={ model } formTag={ false } ref="form" fields={ fields} actions={ this.props.actions } store={ this.props.store } />
          <div className="modal-footer">
            <button className="btn-success" type="submit">{ state.action }</button>
          </div>
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
        ModelActions.edit(this.props.model);
      } else if (control.action == 'clone') {
        ModelActions.clone(this.props.model);
      } else {
        this.props.model.doAction({ action: control.action });
      }
    },

    render: function () {
      var control  = this.props.control,
          cls      = "label label-" + control.css,
          icon_cls = "icon-" + control.icon;

      return (
        <a className={cls} title={control.title} onClick={this.onClick}><i className={icon_cls} /></a>
      );
    }
  });

  var ErrorsTable = React.createBackboneClass({
    getInitialState: function () {
      return {
        fetched: this.props.collection.size() > 0,
        search_text: '',
        size: this.props.collection.size(),
        excludes: this.props.excludes
      };
    },

    onSubmit: function (e) {
      e.preventDefault();
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
      if (!this.state.fetched) {
        console.log('update', this.state.fetched);
        this._fetch(true);
      }
    },

    componentWillReceiveProps: function (nextProps) {
      this.setState({
        excludes: nextProps.excludes
      });

      if (this.props.modelId !== nextProps.modelId) {
        this._fetch(true);
      }
    },

    _fetch: function (force) {
      if (this.isMounted()) {
        var self       = this,
            isBackbone = this.props.collection instanceof Backbone.Collection;

        if ((!this.state.fetched || force) && isBackbone) {
          this.props.collection.fetch({
            success: function (col) {
              if (self.isMounted()) {
                self.setState({
                  fetched: true,
                  search_text: '',
                  size: col.size()
                });
              }
            }
          });
        }
      }
    },

    render: function () {
      var col     = this.props.collection,
          search  = this.state.search_text,
          excludes = this.state.excludes,
          filtered = col;

      if (search || this.state.excludes) {
        filtered = col.filter(function (m) {
          if (_.contains(excludes, m.get('error'))) {
            return false;
          }

          return  m.get('error').toLowerCase().indexOf(search) !== -1;
        });
      }

      return (
        <div className="relative">
          <h4>{ this.props.name }</h4>
          <div className="pull-right">
            <form className="form-search form-small" onSubmit={ this.onSubmit }>
              <div className="input-append search-box">
                <input type="text" className="search-query appendInputButton" placeholder="Search..." value={ this.state.search_text } onChange={ this.onSearch } />
                <button type="submit" className="btn">&nbsp;<i className="icon-search"></i></button>
              </div>
            </form>
          </div>
          <TableView collection={ filtered } collection_fetched={ this.state.fetched } className="table table-striped table-condensed">
            <Col name="Name" className="name">
              <ErrorCell className="name" />
            </Col>
            <Col name="Severity">
              <Cell dataKey="severity" />
            </Col>
            <Col name="Retry">
              <StatusIconContainer dataKey="retry_flag" />
            </Col>
            <Col name="Delay">
              <Cell dataKey="retry_delay_secs" />
            </Col>
            <Col name="Business">
              <StatusIconContainer dataKey="business_flag" />
            </Col>
            <Col>
              <Controls model={ this.props.model } modelId={ this.props.modelId } controlView={ ErrorControlsView } />
            </Col>
          </TableView>
        </div>
      );
    }
  });

  var ModelActions = Reflux.createActions([
    'edit',
    'clone'
  ]);

  var ModelStore = Reflux.createStore({
    listenables: ModelActions,
    onEdit: function (model) {
      this.trigger({ action: 'Edit', model: model });
    },
    onClone: function (model) {
      this.trigger({ action: 'Clone', model: model });
    }
  });


  var ModalContainer = React.createClass({
    mixins: [Reflux.listenTo(ModelStore, 'onStoreChange')],

    onStoreChange: function (state) {
      this.showModal(state);
    },

    render: function () {
      return <span />;
    },

    showModal: function (state) {
      var modal, el;

      model = this.prepareModel(state.model);

      modal = (
        <ModalView title={ state.action + " " + model.get('error') }>
          <ErrorForm model={ model } state={ state } collection={ this.props.collection } modelId={ this.props.modelId } />
        </ModalView>
      );

      el = $('<div class="modal-container" />').appendTo('body');
      React.render(modal, el[0]);
    },

    prepareModel: function (model) {
      var attrs = _.pluck(fields, 'attrName');

      if (model.get('type') === 'global') {
        var nextModel = _.pick(model.toJSON(), attrs);

        nextModel.workflowid = this.props.modelId;
        nextModel.type = 'workflow';

        model = new ErrorModel(nextModel);

        model.is_new = true;
      }

      return model;
    }
  });


  var ErrorsContainer = React.createClass({
    getInitialState: function () {
      return this.getInitialCollections();
    },

    getInitialCollections: function (id) {
      var errors  = new ErrorsCollection([], { workflowid: id || this.props.modelId }),
          global  = GlobalErrors;

      if (this.state && this.state.errors_collection) {
        this.state.errors_collection.off();
      }

      errors.on('add remove', function () { this.forceUpdate(); }.bind(this));

      return {
        errors_collection: errors,
        global_collection: global
      };
    },

    componentWillReceiveProps: function (nextProps) {
      if (this.props.modelId !== nextProps.modelId) {
        this.setState(this.getInitialCollections(nextProps.modelId));
      }
    },

    componentWillUnmount: function () {
      if (this.state.errors_collection) {
        this.state.errors_collection.off();
      }
    },

    render: function () {
      return (
        <div>
          <ErrorsTable collection={ this.state.errors_collection } name="Workflow definitions" modelId={this.props.model.id} />
          <ErrorsTable collection={ this.state.global_collection } name="Global definitions" modelId={this.props.model.id} excludes={ this.state.errors_collection.pluck('error') } />
          <ModalContainer collection={ this.state.errors_collection } modelId={this.props.model.id} />
        </div>
      );
    }
  });

  var LogViewContainer = React.createBackboneClass({
    mixins: [ViewHeightMixin, TabUpdateRefluxMixin],

    shouldComponentUpdate: function (nextProps, nextState) {
      return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    },

    getInitialState: function () {
      return {
        rows: [],
        scroll: true,
        pause: false
      };
    },

    _connect: function (props) {
      // close websocket connection if already connected
      this.actions.close();

      var url = [settings.WS_HOST, 'log', 'workflows', props.model.id].join('/');

      this.actions.connect(url);
    },

    componentWillMount: function () {
      this.actions = new LogActions();
      this.store = new LogStore(this.actions);
      this.unsubscribe = this.store.listen(this.onStoreUpdate);

      this._connect(this.props);
    },

    onTabUpdate: function (state) {
      if (state.active_index == this.props.idx) {
        _.defer(this._setHeight);
        _.defer(this.refs.log.scroll);
      }
    },

    componentWillReceiveProps: function (nextProps) {
      this._connect(nextProps);
    },

    componentWillUnmount: function () {
      this.actions.close();
      this.unsubscribe();
    },

    onStoreUpdate: function (st) {
      if (this.isMounted()) {
        this.setState(st);
      }
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
          <LogView rows={ this.state.rows }
              actions={ this.actions } scroll={ this.state.scroll }
              pause={ this.state.pause } model={ this.props.model.id }
              ref="log"/>
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
          tabs = {
            detail: <Tab name="Detail">
              <InfoView model={ model } />
            </Tab>,
            library: <Tab name="Library">
              <LibraryViewContainer model={ model } />
            </Tab>,
            steps: <Tab name="Steps">
              <DiagramView model={ model } />
            </Tab>,
            log: <Tab name="Log">
              <LogViewContainer model={ model } name="log" />
            </Tab>,
            error: <Tab name="Errors">
              <ErrorsContainer model={ model } modelId={ model.id } />
            </Tab>,
            mappers: <Tab name="Mappers"><MapperList mappers={ new MappersCollection(model.get('mappers')) } /></Tab>
          },
          omit =  ['options', 'lib', 'stepmap',
                   'segment', 'steps', 'stepseg',
                   'stepinfo', 'wffuncs', 'groups',
                   'alerts', 'exec_count', 'autostart',
                   'has_alerts', 'TOTAL', 'timestamp'];


          omit = omit.concat(_.pluck(ORDER_STATES, 'name'));

      tabs.info = <Tab name="Info">
                    <MetaTable data={ _.omit(model.toJSON(), omit) } />
                  </Tab>;

      if (model.get('has_alerts')) {
        tabs.alerts =  <Tab name="Alerts">
                          <AlertsTable model={ model } />
                        </Tab>;
      }

      return (
        <div className="heading">
          <div className="row-fluid relative">
            <h3 className="pull-left"><span className="selectable">{ this.props.model.get('name') }</span> <small>{ this.props.model.get('version') }</small></h3>
            <div className="controls"><ControlsView model={ this.props.model } /> <AutostartView model={ this.props.model } /></div>
            <TabsView store={ store } actions={ actions }>
            { React.addons.createFragment(tabs) }
            </TabsView>
          </div>
        </div>
      );
    }
  });


  var DetailView = React.createBackboneClass({
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
