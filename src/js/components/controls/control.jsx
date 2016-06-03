import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';
import { pureRender } from '../utils';

/**
 * Control button component.
 */
@pureRender
export default class Control extends Component {
  static propTypes = {
    title: PropTypes.string,
    label: PropTypes.string,
    btnStyle: PropTypes.string,
    icon: PropTypes.string,
    action: PropTypes.func,
    disabled: PropTypes.bool,
    big: PropTypes.bool,
    type: PropTypes.string,
    css: PropTypes.object,
    className: PropTypes.string,
  };

  /**
   * Calls `action` prop if set.
   *
   * @param {Event} event
   */
  handleClick = (event) => {
    if (!this.props.action) return;

    event.preventDefault();
    this.props.action(event);
  };

  renderIcon() {
    if (!this.props.icon) return null;

    return <i className={classNames(['fa', `fa-${this.props.icon}`])} />;
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const className = classNames(this.props.className, {
      btn: true,
      'btn-xs': !this.props.big,
      [`btn-${this.props.btnStyle}`]: this.props.btnStyle,
    });

    return (
      <button
        className={className}
        title={this.props.title}
        onClick={this.handleClick}
        disabled={this.props.disabled}
        type={this.props.type}
        style={this.props.css}
      >
        {this.renderIcon()}
        {this.props.label ? ` ${this.props.label}` : ''}
      </button>
    );
  }
}
