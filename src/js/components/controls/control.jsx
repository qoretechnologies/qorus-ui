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
    title?: string,
    label?: string,
    btnStyle: string,
    icon?: string,
    action?: () => void,
    onClick?: () => void,
    stopPropagation?: boolean,
    disabled?: boolean,
    big?: boolean,
    type?: string,
    css?: Object,
    id?: string,
    className?: string,
    children?: React.Element<*> | Array<React.Element<*>>,
  };

  /**
   * Calls `action` prop if set.
   *
   */
  handleClick = (event: Object): void => {
    const action = this.props.action || this.props.onClick;
    if (!action) return;

    event.preventDefault();

    if (this.props.stopPropagation) {
      event.stopPropagation();
    }

    action(event);
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
        id={this.props.id}
        className={className}
        title={this.props.title}
        onClick={this.handleClick}
        disabled={this.props.disabled}
        type={this.props.type}
        style={this.props.css}
      >
        {this.renderIcon()}
        {this.props.label ? ` ${this.props.label}` : ''}
        {this.props.children}
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
