import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utils';


/**
 * Wrapper for Group elements.
 */
@pureRender
export default class Groups extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element)
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div className='groups'>
        <h4>Groups</h4>
        {this.props.children}
      </div>
    );
  }
}
