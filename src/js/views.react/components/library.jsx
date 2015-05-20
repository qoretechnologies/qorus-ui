define(function (require) {
  var React            = require('react'),
      Reflux           = require('reflux'),
      _                = require('underscore'),
      TabsView         = require('jsx!views.react/components/tabs').TabsView,
      TabPane          = require('jsx!views.react/components/tabs').TabPane,
      NavItem          = require('jsx!views.react/components/tabs').NavItem,
      slugify          = require('qorus/helpers').slugify,
      CodeView         = require('jsx!views.react/components/code'),
      Actions          = require('views.react/actions/tabs'),
      Store            = require('views.react/stores/tabs'),
      ModelRenderMixin = require('views.react/mixins/modelrender'),
      Tabs;

  require('react.backbone');

  var Navigation = React.createClass({
    render: function () {
      var props = this.props, groups = [], model_groups = props.model.get('lib');

      if (model_groups) {
        var ctr = 0;
        groups = _.map(model_groups, function (group, name) {
          if (group.length > 0) {
            var out = [<li className="nav-header">{ name }</li>],
                header;

            _.each(group, function (g) {
              var nam, add = '';

              if (g.version) {
                add += 'v' + g.version;
              }

              if (g.patch) {
                add += '.' + g.patch;
              }

              if (g.header !== header) {
                out.push(<li className="nav-header nav-subheader">{ g.name }</li>);
              }

              if (g.name && g.type) {
                var append = (add.length > 0) ? <small>{ add }</small> : null;
                nam = <span><small className="label">{ g.type }</small><br />{ g.name } { append }</span>;
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
          }
        });
      }

      return (
          <ul className="nav nav-list break-word">
            { groups }
          </ul>
      );
    }
  });

  var LibraryView = React.createBackboneClass({
    getInitialState: function () {
      return {
        active_index: 0
      };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      var should = true;

      should = (!_.isEqual(nextProps, this.props) || !_.isEqual(this.state, nextState));

      return should;
    },

    onTabChange: function (idx) {
      this.setState({ active_index: idx });
    },

    preparePanes: function () {
      var ctr    = 0,
          props  = this.props,
          state  = this.state,
          groups = props.model.get('lib'),
          panes;

      if (groups) {
        panes = _.map(groups, function (group) {
          var plist = [];

          _.each(group, function (g) {

            var p = _.extend({}, _.omit(props, 'children'), {
              slug: slugify(g.name),
              idx: ctr,
            }, state);

            plist.push(<TabPane {...p} key={ g.name }><CodeView code={ g.body } offset={ g.offset } /></TabPane>);
            ctr++;
          });

          return plist;
        });
      }

      panes = _.flatten(panes);

      return panes;
    },

    render: function() {
      var props = this.props,
          state = this.state,
          panes = this.preparePanes();

      return (
        <div>
          <div className="well span3 library-navigation">
            <Navigation model={ props.model } active_index={ this.state.active_index } tabChange={ this.onTabChange } />
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
