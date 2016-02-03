import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment';
import { slugify } from '../../utils';


import Item from './item';
import Pane from './pane';


/**
 * Tabs with nav item to switch and tab panes with content.
 *
 * Only an active tab pane is actually rendered. When a new tab is
 * activated, this component does not change its state to do trigger
 * new render cycle. Instead, it call `tabChange` prop callback which
 * should result in `active` prop change. This is to allow parent
 * components to map tabs to some URL routing scheme.
 *
 * TODO: Explore generating URLs in parent and using Link component
 * from React Router.
 */
export default class Tabs extends Component {
  static propTypes = {
    children: PropTypes.node,
    active: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    tabChange: PropTypes.func
  };


  static defaultProps = {
    tabChange: () => undefined
  };


  /**
   * Calls `tabChange` prop when nav item has been been activated.
   *
   * @param {string} slug
   */
  onTabChange(slug) {
    this.props.tabChange(slug);
  }


  /**
   * Finds an active slug.
   *
   * If `active` prop is set, it is used. Otherwise, the first child
   * is considered as active.
   *
   * @return {string}
   */
  activeSlug() {
    return this.props.active || (
      this.props.children &&
      this.props.children[0] &&
      (this.props.children[0].props.slug ||
       slugify(this.props.children[0].props.name))
    );
  }


  /**
   * Checks if given slug is an active one.
   *
   * @param {string} slug
   * @return {boolean}
   */
  isActive(slug) {
    return this.activeSlug() === slug;
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div className={this.props.className}>
        <ul className='nav nav-tabs'>
          {React.Children.map(this.props.children, tab => {
            const { name, children, slug: slugMaybe, ...other } = tab.props;
            const slug = slugMaybe || slugify(name);

            return (
              <Item
                {...other}
                active={this.isActive(slug)}
                slug={slug}
                name={name}
                tabChange={::this.onTabChange}
              />
            );
          })}
        </ul>
        <div className='tab-content'>
          {React.Children.map(this.props.children, tab => {
            const { name, children, slug: slugMaybe, ...other } = tab.props;
            const slug = slugMaybe || slugify(name);

            return (
              <Pane
                {...other}
                active={this.isActive(slug)}
                slug={slug}
                name={name}
              >
                {this.isActive(slug) && children}
              </Pane>
            );
          })}
        </div>
      </div>
    );
  }
}


export { Item, Pane };
