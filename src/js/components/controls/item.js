import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { pureRender } from '../utils';


@pureRender
export default class Control extends Component {
  static propTypes = {
    title: PropTypes.string,
    labelStyle: PropTypes.string,
    icon: PropTypes.string.isRequired,
    action: PropTypes.func
  }

  onClick(e) {
    e.stopPropagation();

    if (this.props.action) this.props.action();
  }

  render() {
    return (
      <a
          className={classNames({
            'label': true,
            ['label-' + this.props.labelStyle]: this.props.labelStyle,
            'label-default': !this.props.labelStyle
          })}
          title={this.props.title}
          onClick={this.onClick.bind(this)}>
        <i className={classNames(['fa', 'fa-' + this.props.icon])} />
      </a>
    );
  }
}
