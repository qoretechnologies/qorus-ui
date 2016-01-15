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
    action: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (!this.props.action) return;

    e.preventDefault();
    this.props.action();
  }

  render() {
    return (
      <button
        className={classNames({
          btn: true,
          'btn-xs': true,
          ['btn-' + this.props.btnStyle]: this.props.btnStyle
        })}
        title={this.props.title}
        onClick={this.onClick}
      >
        <i className={classNames(['fa', 'fa-' + this.props.icon])} />
        {this.props.label ? (' ' + this.props.label) : ''}
      </button>
    );
  }
}
