define(function (require) {
  var React    = require('react'),
      Reflux   = require('reflux'),
      slugify  = require('qorus/helpers').slugify,
      Actions  = require('views.react/actions/tabs'),
      Store    = require('views.react/stores/tabs'),
      cloneWithProps = React.addons.cloneWithProps;
  
  var NavItem = React.createClass({
    getInitialState: function () {
      var props = this.props;
      return {
        active: props.idx == props.active_index
      };
    },
    
    componentWillReceiveProps: function (nextProps) {
      var wasActive = this.props.idx == this.props.active_index,
          isActive  = nextProps.idx == nextProps.active_index;
      
      if (wasActive != isActive) {
        this.setState({
          active: isActive
        });
      }
    },
  
    shouldComponentUpdate: function  (nextProps, nextState) {
      var props = _.omit(this.props, 'active_index'),
          nProps = _.omit(nextProps, 'active_index');
      
      return (props !== nProps || this.state !== nextState);
    },
  
    tabChange: function (e) {
      e.preventDefault();
      this.props.tabChange(this.props.idx);
    },
    
    render: function () {
      var target = '#' + this.props.slug,
          active = this.state.active;

      return  <li className={React.addons.classSet({ active: active })} >
                <a data-target={target} onClick={ this.tabChange }>{ this.props.name }</a>
              </li>;
    }
  });

  var TabPane = React.createClass({
    getInitialState: function () {
      var props = this.props;
      return {
        active: props.idx == props.active_index
      };
    },
    
    componentWillReceiveProps: function (nextProps) {
      var wasActive = this.props.idx == this.props.active_index,
          isActive  = nextProps.idx == nextProps.active_index;
      
      if (wasActive != isActive) {
        this.setState({
          active: isActive
        });
      }
    },
  
    shouldComponentUpdate: function  (nextProps, nextState) {
      var props = _.pick(this.props, ['idx', 'slug', 'children']),
          nProps = _.pick(this.props, ['idx', 'slug', 'children']),
          should;
          
      should = (!_.isEqual(props, nProps) || !_.isEqual(this.state, nextState));
      
      return true; //should;
    },
    
    render: function () {
      var props     = this.props,
          children  = cloneWithProps(this.props.children, _.pick(this.props, ['idx', 'store', 'actions'])),
          active    = this.state.active;
      
      return <div id={this.props.slug} className={ React.addons.classSet({ 'tab-pane': true, active: active }) }>
               { children }
             </div>;
    }
  });
  
  var TabsView = React.createClass({
    getInitialState: function () {
      return {
        active_index: 0
      };
    },
    
    getDefaultProps: function () {
      return {
        cssClass: "nav nav-tabs"  
      };
    },
   
    onTabChange: function (idx) {
      this.setState({
        active_index: idx
      });
    },
  
    componetWillReceiveProps: function (nextProps) {
      console.log('children', React.Children.count(nextProps.children), nextProps);
    },
  
    render: function () {
      var navigation = {}, tabs = {}, ctr=0;
      var props = _.omit(this.props, ['tabs', 'cssClass', 'navItemView', 'tabPaneView']);
      
      props = _.extend({}, props, this.state);

      React.Children.forEach(this.props.children, function (tab, idx) {
        var slug = slugify(tab.props.name);
        navigation["nav-"+slug] = <NavItem {...props} slug={slug} name={tab.props.name} idx={ ctr } tabChange={ this.onTabChange } />;
        tabs["tab"+slug] = <TabPane {...props} slug={slug} idx={ ctr }>{ tab.props.children }</TabPane>;
        ctr++;
      }.bind(this));
      
      return  <div>
                <ul className={this.props.className||this.props.cssClass}>
                  { React.addons.createFragment(navigation) }
                </ul>
                <div className="tab-content">
                  { React.addons.createFragment(tabs) }
                </div>
              </div>;
    }
  });
  
  return {
    NavItem: NavItem,
    Tab: TabPane,
    TabPane: TabPane,
    TabsView: TabsView
  };
});