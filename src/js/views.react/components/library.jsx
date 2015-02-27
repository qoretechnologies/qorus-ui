define(function (require) {
  var React      = require('react'),
      Reflux     = require('reflux'),
      _          = require('underscore'),
      TabPane    = require('jsx!views.react/components/tabs').TabPane,
      NavItem    = require('jsx!views.react/components/tabs').NavItem,
      slugify    = require('qorus/helpers').slugify,
      CodeView   = require('jsx!views.react/components/code'),
      Actions    = require('views.react/actions/tabs'),
      Store      = require('views.react/stores/tabs'),
      ModelRenderMixin = require('views.react/mixins/modelrender'),
      LibraryView, Tabs, Navigation;

  require('react.backbone');

  Navigation = React.createClass({
    render: function () {
      var props = this.props, groups = [], model_groups = props.model.get('lib');
      
      if (model_groups) {
        var ctr = 0;
        groups = _.map(model_groups, function (group, name) {
          var out = [<li className="nav-header">{ name }</li>],
              header;

          _.each(group, function (g) {
            var nam;
            
            if (g.header !== header) { 
              out.push(<li className="nav-header nav-subheader">{ g.header }</li>);
            }
            
            if (g.name && g.type) {
              nam = <span><small className="label">{ g.type }</small><br />{ g.name }</span>;
            } else {
              nam = g.name;
            }
            
            if (g.name) {
              out.push(<NavItem {...props} name={ nam } slug={ slugify( g.name ) } idx={ ctr } />);
              ctr++;            
            }
            header = g.header;
          });

          return out;
        });      
      }

    
      return (
          <ul className="nav nav-list break-word">
            { groups }
          </ul>
      );
    }
  });

  LibraryView = React.createBackboneClass({
    mixins: [ModelRenderMixin],
    getInitialState: function () {
      var actions = Actions();
      return  {
        store: Store(actions),
        actions: actions
      };
    },
    
    componentWillReceiveProps: function () {
      this.state.actions.reset();
    },
        
    render: function () {
      var ctr     = 0, 
          props   = this.props,
          store   = this.state.store,
          actions = this.state.actions;
          
      var panes = _.map(this.props.model.get('lib'), function (group) {
        var panes = [];
        
        _.each(group, function (g) {
          var p = _.extend({}, props, {
            store: store,
            actions: actions,
            slug: slugify(g.name),
            idx: ctr
          });
          
          panes.push(<TabPane {...p}><CodeView code={ g.body } /></TabPane>);
          ctr++;
        });
        
        return panes;
      });
    
      return (
        <div>
          <div className="well span3 library-navigation">
            <Navigation model={ props.model } store={ store } actions={ actions } onTabChange={ this.onTabChange } />
          </div>
          <div className="span9 tab-content library-content">
            { panes }
          </div>
        </div>
      );
    }
  });
  
  return LibraryView;
});