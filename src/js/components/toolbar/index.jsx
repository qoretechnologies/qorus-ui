import React, { Component, PropTypes } from 'react';


/**
 * Workflow table toolbar.
 *
 * The toolbar controls are children.
 */
export default class Toolbar extends Component {
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
      <div id='workflows-toolbar' className='toolbar'>
        <div className='workflows-toolbar btn-toolbar sticky toolbar'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
