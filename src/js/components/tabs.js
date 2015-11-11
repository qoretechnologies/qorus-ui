import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment';
import { omit, extend } from 'lodash';
import clNs from 'classnames';
import { slugify } from '../utils';

export class TabGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    active: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    cssClass: PropTypes.string,
    tabChange: PropTypes.func
  }

  static defaultProps = {
    cssClass: 'nav nav-tabs'
  }

  activeSlug() {
    return this.props.active || (
      this.props.children &&
      this.props.children[0] &&
      (this.props.children[0].props.slug ||
       slugify(this.props.children[0].props.name))
    );
  }

  isActive(slug) {
    return this.activeSlug() === slug;
  }

  onTabChange = slug => {
    if (!this.props.tabChange) return;

    this.props.tabChange(slug);
  }

  render() {
    let navigation = {};
    let tabs = {};

    React.Children.forEach(this.props.children, tab => {
      const { name, children, ...otherWithSlugh } = tab.props;
      let { slug, ...other } = otherWithSlugh;
      slug = slug || slugify(name);

      navigation[`nav-${slug}`] = (
        <TabNavigationItem {...other}
          slug={slug}
          name={name}
          ref={ slug }
          tabChange={ this.onTabChange }
          active={ this.isActive(slug) } />
      );
      tabs[`tab${slug}`] = (
        <Tab {...other}
          active={ this.isActive(slug) }
          slug={slug}
          name={name}
          ref={ `pane-${slug}` }>
          { children }
        </Tab>
      );
    });

    return (
      <div>
        <ul className={this.props.className || this.props.cssClass}>
          { createFragment(navigation) }
        </ul>
        <div className='tab-content'>
          { createFragment(tabs) }
        </div>
      </div>
    );
  }
}

export class TabNavigationItem extends Component {
  static propTypes = {
    target: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string.isRequired,
    tabChange: PropTypes.func,
    active: PropTypes.bool
  }

  render() {
    const { target, name, active, slug, tabChange } = this.props;

    return (
      <li className={ clNs({ active: active })} >
        <a data-target={ target } onClick={ () => { tabChange(slug); } }>
          { name }
        </a>
      </li>
    );
  }
}

export class Tab extends Component {
  static propTypes = {
    slug: PropTypes.string,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    children: PropTypes.node
  }

  render() {
    const { slug, children, active } = this.props;

    if (!slug) {
      throw new Error('Property slug must be provided by parent component.');
    }

    return (
      <div
        id={ slug }
        className={ clNs({ 'tab-pane': true, active: active }) }>
        { children }
      </div>
    );
  }
}
