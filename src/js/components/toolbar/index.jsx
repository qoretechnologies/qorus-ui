import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

/**
 * Workflow table toolbar.
 *
 * The toolbar controls are children.
 */
export default class Toolbar extends Component {
  static propTypes = {
    children: PropTypes.node,
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div
        className={classNames('btn-toolbar', 'toolbar')}
        role="toolbar"
      >
        {this.props.children}
      </div>
    );
  }
}
