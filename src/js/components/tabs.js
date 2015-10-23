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

<<<<<<< HEAD
  static defaultProps = {
    cssClass: 'nav nav-tabs'
  }

  state = {
    active: slugify(this.props.children[0].props.name)
  }

  onTabChange = (tab) => {
    this.setState({ active: tab });
  }

=======
>>>>>>> parent of 22da4bd... Tabs  update
  render() {
    let navigation;
    let tabs;
    let ctr = 0;
    const props = omit(
      this.props,
      ['tabs', 'cssClass', 'navItemView', 'tabPaneView']
    );

    navigation = {};
    tabs = {};

    props = extend({}, props, this.state);
<<<<<<< HEAD
    const onTabChange = this.onTabChange;
    const active = this.state.active;
=======
>>>>>>> parent of 22da4bd... Tabs  update

    React.Children.forEach(this.props.children, function (tab) {
      const slug = slugify(tab.props.name);

      navigation[`nav-${slug}`] = (
        <TabNavigationItem {...props}
          slug={slug}
          name={tab.props.name}
<<<<<<< HEAD
          ref={ slug }
          tabChange={ onTabChange }
          active={ active === slug } />
      );
      tabs[`tab${slug}`] = (
        <Tab {...props}
          active={ active === slug }
          slug={slug}
          ref={ `pane-${slug}` }>
=======
          idx={ ctr }
          tabChange={ this.onTabChange } />
      );
      tabs[`tab${slug}`] = (
        <TabPane {...props} slug={slug} idx={ ctr }>
>>>>>>> parent of 22da4bd... Tabs  update
          { tab.props.children }
        </TabPane>
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
<<<<<<< HEAD
    name: PropTypes.string,
    slug: PropTypes.string.isRequired,
    tabChange: PropTypes.func,
    active: PropTypes.bool
  }

  render() {
    const { target, name, active, slug, tabChange } = this.props;
=======
    name: PropTypes.string
  }

  render() {
    const { target, name } = this.props;
>>>>>>> parent of 22da4bd... Tabs  update

    return (
      <li className={ clNs({ active: active })} >
        <a data-target={ target } onClick={ () => { tabChange(slug); } }>
          { name }
        </a>
      </li>
    );
  }
}

export class TabPane extends Component {
  render() {
<<<<<<< HEAD
    const { slug, children, active } = this.props;

    return (
      <div
        id={ slug }
        className={ clNs({ 'tab-pane': true, active: active }) }>
        { children }
      </div>
    );
=======
    return null;
>>>>>>> parent of 22da4bd... Tabs  update
  }
}
