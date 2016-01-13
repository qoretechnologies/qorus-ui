import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment';
import classNames from 'classnames';
import { slugify } from '../utils';


export class TabGroup extends Component {
  static propTypes = {
    children: PropTypes.node,
    active: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    cssClass: PropTypes.string,
    tabChange: PropTypes.func
  };

  static defaultProps = {
    cssClass: 'nav nav-tabs'
  };

  constructor(props) {
    super(props);

    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(slug) {
    if (!this.props.tabChange) return;

    this.props.tabChange(slug);
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

  render() {
    const navigation = {};
    const tabs = {};

    React.Children.forEach(this.props.children, tab => {
      const { name, children, ...otherWithSlugh } = tab.props;
      const { slug: slugMaybe, ...other } = otherWithSlugh;
      const slug = slugMaybe || slugify(name);

      navigation[`nav-${slug}`] = (
        <TabNavigationItem {...other}
          slug={slug}
          name={name}
          ref={slug}
          tabChange={this.onTabChange}
          active={this.isActive(slug)}
        />
      );
      tabs[`tab${slug}`] = (
        <Tab {...other}
          active={this.isActive(slug)}
          slug={slug}
          name={name}
          ref={`pane-${slug}`}
        >
          {children}
        </Tab>
      );
    });

    return (
      <div>
        <ul className={this.props.className || this.props.cssClass}>
          {createFragment(navigation)}
        </ul>
        <div className='tab-content'>
          {createFragment(tabs)}
        </div>
      </div>
    );
  }
}


export class TabNavigationItem extends Component {
  static propTypes = {
    target: PropTypes.string,
    name: PropTypes.node,
    slug: PropTypes.string.isRequired,
    tabChange: PropTypes.func,
    active: PropTypes.bool,
    disabled: PropTypes.bool
  };

  componentWillMount() {
    this.onClick = this.props.tabChange.bind(this, this.props.slug);
  }

  componentWillUpdate(nextProps) {
    this.onClick = nextProps.tabChange.bind(this, nextProps.slug);
  }

  render() {
    const { target, name, active, disabled } = this.props;

    return (
      <li role='presentation' className={classNames({ active, disabled })}>
        <a data-target={target} onClick={this.onClick}>
          {name}
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
    disabled: PropTypes.bool,
    children: PropTypes.node
  };

  render() {
    const { slug, children, active, disabled } = this.props;

    if (!slug) {
      throw new Error('Property slug must be provided by parent component.');
    }

    return (
      <div
        id={slug}
        className={classNames({ 'tab-pane': true, active, disabled })}
      >
        {children}
      </div>
    );
  }
}
