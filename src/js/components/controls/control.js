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
    btnStyle: PropTypes.string,
    icon: PropTypes.string.isRequired,
    action: PropTypes.func
  }

  static defaultProps = {
    btnStyle: 'default'
  }

  onClick(e) {
    if (!this.props.action) return;

    e.preventDefault();
    this.props.action();
  }

  render() {
    return (
      <button
        className={classNames([
          'btn',
          'btn-xs',
          'btn-' + this.props.btnStyle
        ])}
        title={this.props.title}
        onClick={this.onClick.bind(this)}
      >
        <i className={classNames(['fa', 'fa-' + this.props.icon])} />
      </button>
    );
  }
}
