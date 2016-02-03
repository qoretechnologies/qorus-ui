import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


/**
 * Tab navigation item.
 */
export default class Item extends Component {
  static propTypes = {
    target: PropTypes.string,
    name: PropTypes.node,
    slug: PropTypes.string.isRequired,
    tabChange: PropTypes.func,
    active: PropTypes.bool,
    disabled: PropTypes.bool
  };


  /**
   * Creates onClick event handler from `tabChange` prop.
   */
  componentWillMount() {
    this.onClick = this.props.tabChange.bind(this, this.props.slug);
  }


  /**
   * Creates onClick event handler from `tabChange` prop.
   */
  componentWillUpdate(nextProps) {
    this.onClick = nextProps.tabChange.bind(this, nextProps.slug);
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <li
        role='presentation'
        className={classNames({
          active: this.props.active,
          disabled: this.props.disabled
        })}
      >
        <a data-target={this.props.target} onClick={this.onClick}>
          {this.props.name}
        </a>
      </li>
    );
  }
}
