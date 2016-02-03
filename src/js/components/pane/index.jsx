import React, { Component, PropTypes } from 'react';
import ResizeHandle from '../resize/handle';


/**
 * Pane flowing above other content sticked to the right.
 *
 * It also has convenient close button.
 */
export default class Pane extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
    width: PropTypes.number
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div
        className='pane right'
        style={{ width: this.props.width }}
      >
        <button
          type='button'
          className='btn btn-xs btn-inverse pane__close'
          onClick={this.props.onClose}
        >
          <i className='fa fa-times-circle' /> Close
        </button>
        <div className='pane__content'>
          {this.props.children}
        </div>
        <ResizeHandle left min={{ width: 400 }} />
      </div>
    );
  }
}
