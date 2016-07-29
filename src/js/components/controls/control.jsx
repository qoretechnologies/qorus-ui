/* @flow */
import React, { Component, PropTypes } from 'react';

import classNames from 'classnames';
import { pureRender } from '../utils';

/**
 * Control button component.
 */
@pureRender
export default class Control extends Component {
  props: {
    title: string,
    label: string,
    btnStyle: string,
    icon: string,
    action: () => void,
    disabled: boolean,
    big: boolean,
    type: string,
    css: Object,
    className: string,
  };

  /**
   * Calls `action` prop if set.
   *
   */
  handleClick = (event: Object): void => {
    if (!this.props.action) return;

    event.preventDefault();
    this.props.action(event);
  };

  renderIcon(): ?React.Element<any> {
    if (!this.props.icon) return null;

    return <i className={classNames(['fa', `fa-${this.props.icon}`])} />;
  }

  /**
   * Returns element for this component.
   */
  render(): React.Element<any> {
    const className: string = classNames(this.props.className, {
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
        {...this.props}
      >
        {this.renderIcon()}
        {this.props.label ? ` ${this.props.label}` : ''}
      </button>
    );
  }
}

Control.propTypes = {
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
