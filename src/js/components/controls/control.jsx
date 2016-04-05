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
    icon: PropTypes.string.isRequired,
    action: PropTypes.func,
    disabled: PropTypes.bool,
  };


  /**
   * Calls `action` prop if set.
   *
   * @param {Event} ev
   */
  onClick(ev) {
    if (!this.props.action) return;

    ev.preventDefault();
    this.props.action();
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <button
        className={classNames({
          btn: true,
          'btn-xs': true,
          [`btn-${this.props.btnStyle}`]: this.props.btnStyle,
        })}
        title={this.props.title}
        onClick={::this.onClick}
        disabled={this.props.disabled}
      >
        <i className={classNames(['fa', `fa-${this.props.icon}`])} />
        {this.props.label ? ` ${this.props.label}` : ''}
      </button>
    );
  }
}
