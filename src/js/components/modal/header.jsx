import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Modal header with title, title HTML ID and close button.
 *
 * Title HTML ID is for ARIA in connection with the whole modal
 * pane. Title itself is represented by children.
 */
@pureRender
export default class Header extends Component {
  static propTypes = {
    titleId: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    children: PropTypes.node,
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div className="modal-header">
        {this.props.onClose && (
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={this.props.onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
        {this.props.children && (
          <h4 className="modal-title" id={this.props.titleId}>
            {this.props.children}
          </h4>
        )}
      </div>
    );
  }
}
