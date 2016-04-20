import React, { Component, PropTypes } from 'react';
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
 * If `tabChange` prop callback is not set, this component manages
 * `active` prop on items and panes itself. In such case, `active`
 * prop should not be set outside of this component to prevent
 * confusion.
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
    tabChange: PropTypes.func,
    type: PropTypes.string,
    navAtBottom: PropTypes.bool,
  };

  static defaultProps = {
    type: 'tabs',
    navOnBottom: false,
  };

  componentWillMount() {
    this.setState({ activeSlug: this.activeSlug(this.props) });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.activeSlug !== this.activeSlug(nextProps)) {
      this.setState({ activeSlug: this.activeSlug(nextProps) });
    }
  }

  /**
   * Changes active tab.
   *
   * If `tabChange` prop callback is not set, it updates internal
   * state. If it is set, it is expected that the callback changes
   * active tab by setting pane `active` props accordingly.
   *
   * @param {string} slug
   */
  onTabChange = (slug) => {
    if (!this.props.tabChange) {
      this.setState({ activeSlug: slug });
    } else {
      this.props.tabChange(slug);
    }
  };

  /**
   * Finds an active slug.
   *
   * If `active` prop is set, it is used. Otherwise, the first child
   * is considered as active.
   *
   * @param {Object} props
   * @return {string}
   */
  activeSlug(props) {
    return props.active || (
      props.children &&
      props.children[0] &&
      (props.children[0].props.slug ||
       slugify(props.children[0].props.name))
    );
  }

  renderNav() {
    return (
      <ul className={`nav nav-${this.props.type}`}>
        {React.Children.map(this.props.children, tab => {
          const { name, slug: slugMaybe, ...other } = tab.props;
          const slug = slugMaybe || slugify(name);
          delete other.children;

          return (
            <Item
              {...other}
              active={this.state.activeSlug === slug}
              slug={slug}
              name={name}
              tabChange={this.onTabChange}
            />
          );
        })}
      </ul>
    );
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div className={this.props.className}>
        { !this.props.navAtBottom && this.renderNav() }
        <div className="tab-content">
          {React.Children.map(this.props.children, tab => {
            const { name, children, slug: slugMaybe, ...other } = tab.props;
            const slug = slugMaybe || slugify(name);

            return (
              <Pane
                {...other}
                active={this.state.activeSlug === slug}
                slug={slug}
                name={name}
              >
                {this.state.activeSlug === slug && children}
              </Pane>
            );
          })}
        </div>
        { this.props.navAtBottom && this.renderNav() }
      </div>
    );
  }
}


export { Item, Pane };
