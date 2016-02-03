import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Wrapper for modal footer content (usually action buttons).
 */
@pureRender
export default class Footer extends Component {
  static propTypes = {
    children: PropTypes.node
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div className='modal-footer'>
        {this.props.children}
      </div>
    );
  }
}
