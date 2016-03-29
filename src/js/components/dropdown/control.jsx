import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Control extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <button
        className={classNames('btn', 'btn-default', 'dropdown-toggle')}
        {...this.props}
      >
        { this.props.children }
        {' '}
        <span className="fa fa-caret-down" />
      </button>
    );
  }
}
