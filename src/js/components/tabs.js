import React, { Component, PropTypes } from 'react/addons';
import { omit, extend } from 'lodash';
import clNs from 'classnames';
import { slugify } from '../utils';

export class TabGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
    className: PropTypes.string,
    cssClass: PropTypes.string
  }

  onTabChange() {
    return true;
  }

  render() {
    let navigation;
    let tabs;
    let ctr = 0;
    let props = omit(
      this.props,
      ['tabs', 'cssClass', 'navItemView', 'tabPaneView']
    );

    navigation = {};
    tabs = {};
    props = extend({}, props, this.state);
    const onTabChange = this.onTabChange;

    React.Children.forEach(this.props.children, function (tab) {
      const slug = slugify(tab.props.name);
      navigation[`nav-${slug}`] = (
        <TabNavigationItem {...props}
          slug={slug}
          name={tab.props.name}
          idx={ ctr }
          tabChange={ onTabChange } />
      );
      tabs[`tab${slug}`] = (
        <Tab {...props} slug={slug} idx={ ctr }>
          { tab.props.children }
        </Tab>
      );
      ctr++;
    });

    return (
      <div>
        <ul className={this.props.className || this.props.cssClass}>
          { React.addons.createFragment(navigation) }
        </ul>
        <div className='tab-content'>
          { React.addons.createFragment(tabs) }
        </div>
      </div>
    );
  }
}

export class TabNavigationItem extends Component {
  static propTypes = {
    target: PropTypes.string,
    name: PropTypes.string,
    onTabChange: PropTypes.func
  }

  tabChange() {
    return true;
  }

  render() {
    const { target, name, active } = this.props;

    return (
      <li className={ clNs({ active: active })} >
        <a data-target={ target } onClick={ this.tabChange }>
          { name }
        </a>
      </li>
    );
  }
}

export class Tab extends Component {
  static propTypes = {
    slug: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool
  }

  render() {
    const { slug, children } = this.props;
    const { active } = this.state;

    return (
      <div
        id={ slug }
        className={ clNs({ 'tab-pane': true, active: active }) }>
        { children }
      </div>
    );
  }
}
