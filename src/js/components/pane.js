import React, { Component, PropTypes } from 'react';
import ResizeHandle from './resize/handle';


export class PaneView extends Component {
  static propTypes = {
    contentView: PropTypes.node,
    children: PropTypes.node,
    onClose: PropTypes.func,
    width: PropTypes.number
  };


  render() {
    const { contentView, children, onClose, width, ...props } = this.props;

    return (
      <div
        className='pageslide left show'
        style={{ width }}
        ref='pageSlide'
      >
        <button
          type='button'
          className='btn btn-xs btn-inverse close-view'
          onClick={onClose}
        >
          <i className='fa fa-times-circle' /> Close
        </button>
        <div className='content'>
          {contentView ? (
            <contentView {...props} />
          ) : children}
        </div>
        <ResizeHandle left min={{ width: 400 }} />
      </div>
    );
  }
}
