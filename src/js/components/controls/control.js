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
    labelStyle: PropTypes.string,
    icon: PropTypes.string.isRequired,
    action: PropTypes.func
  }

  static defaultProps = {
    labelStyle: 'default'
  }

  onClick(e) {
    if (!this.props.action) return;

    e.preventDefault();
    this.props.action();
  }

  render() {
    return (
      <a
        className={classNames([
          'label',
          'label-' + this.props.labelStyle
        ])}
        title={this.props.title}
        onClick={this.onClick.bind(this)}
        href='#'
        role='button'
      >
        <i className={classNames(['fa', 'fa-' + this.props.icon])} />
      </a>
    );
  }
}
