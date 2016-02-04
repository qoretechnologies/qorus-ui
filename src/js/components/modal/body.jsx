import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Wrapper for modal main content.
 */
@pureRender
export default class Body extends Component {
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
      <div className="modal-body">
        {this.props.children}
      </div>
    );
  }
}
