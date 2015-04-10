define(function (require) {
  var React    = require('react'),
      Reflux   = require('reflux'),
      slugify  = require('qorus/helpers').slugify,
      Actions  = require('views.react/actions/tabs'),
      Store    = require('views.react/stores/tabs'),
      cloneWithProps = React.addons.cloneWithProps,
      TabsView = {};
      
  var RefluxMixin = {
    componentDidMount: function () {
      this.unsubscribe = this.props.store.listen(this.onStoreUpdate);
    },
    
    componentWillUnmount: function () {
      this.unsubscribe();
    },
    
    onStoreUpdate: function () {
      var state = this.state.active;
      
      if (state != this.isActive()) {
        this.setState({ active: !state });
      }
    },
  
    isActive: function () {
      return (this.props.idx == this.props.store.state.active_index);
    }
  };
  
  TabsView.NavItem = React.createClass({
    mixins: [RefluxMixin],
    getInitialState: function () {
      return {
        active: this.isActive()
      };
    },
    
    componentDidMount: function () {
      $(this.getDOMNode()).on('click.tab', 'a', function (e) {
        e.stopPropagation();
        e.preventDefault();
/*        $(e.currentTarget).tab('show');*/
        this.props.actions.tabChange(this.props.idx);        
      }.bind(this));
    },
    
    componentWillUnmount: function () {
      $(this.getDOMNode()).off('click.tab');
    },

    render: function () {
      var target = '#' + this.props.slug;
      return (
        <li className={React.addons.classSet({ active: this.isActive() })} >
          <a href={this.props.slug} data-target={target}>{ this.props.name }</a>
        </li>
      );
    }
  });

  TabsView.TabPane = React.createClass({
    mixins: [RefluxMixin],
    getInitialState: function () {
      return {
        active: this.isActive()
      };
    },
  
    render: function () {
      var props = this.props,
          children = cloneWithProps(this.props.children, _.pick(this.props, ['idx', 'store', 'actions']));
      
      return (
        <div id={this.props.slug} className={ React.addons.classSet({ 'tab-pane': true, active: this.isActive() }) }>
          { children }
        </div>
      );
    }
  });
  
  TabsView.Tab = TabsView.TabPane;
  
  TabsView.TabsView = React.createClass({
    getInitialState: function () {
      var actions = Actions();
      return {
        store: Store(actions),
        actions: actions
      };
    },
   
    getDefaultProps: function () {
      return {
        cssClass: "nav nav-tabs"
      };
    },
    
    propTypes: {
      actions: React.PropTypes.object,
      store: React.PropTypes.object
    },
  
    render: function () {
      var navigation = {}, tabs = {}, ctr=0;
      var props = _.omit(this.props, ['tabs', 'cssClass', 'navItemView', 'tabPaneView']);
      
      props = _.extend({}, props, this.state);

      this.props.children.forEach(function (tab) {
        var slug = slugify(tab.props.name);
        navigation["nav-"+slug] = <TabsView.NavItem {...props} slug={slug} name={tab.props.name} idx={ ctr } />;
        tabs["tab"+slug] = <TabsView.TabPane {...props} slug={slug} idx={ ctr }>{ tab.props.children }</TabsView.TabPane>;
        ctr++;
      }.bind(this));
      
      return (
        <div>
          <ul className={this.props.className||this.props.cssClass}>
            { React.addons.createFragment(navigation) }
          </ul>
          <div className="tab-content">
            { React.addons.createFragment(tabs) }
          </div>
        </div>
      );
    }
  });
  
  return TabsView;
});