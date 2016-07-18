/* @flow */
import React, { Component, PropTypes } from 'react';

import ResizeHandle from '../resize/handle';
import Header from './header';
import Body from './body';
import Footer from './footer';

import { pureRender } from '../utils';

/**
 * Modal pane component.
 */
@pureRender
export default class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onMount: PropTypes.func,
  };

  componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount();
    }
  }

  /**
   * Triggers modal's header `onClose` prop if available.
   *
   * It also checks that event has been fired directly on modal
   * element and not on modal dialog or any of its descendants.
   *
   * @param {Event} ev
   */
  onEscape(ev) {
    if (ev.target === this._modal &&
        this.getHeader() && this.getHeader().props.onClose) {
      this.getHeader().props.onClose();
    }
  }

  /**
   * Finds modal Header component in children.
   *
   * @return {Header|null}
   */
  getHeader() {
    return React.Children.toArray(this.props.children).filter(c => (
      c.type === Header
    ))[0] || null;
  }

  /**
   * Stores modal reference for later.
   *
   * @param {HTMLElement} el
   */
  refModal(el) {
    this._modal = el;
  }

  /**
   * Renders necessary elements around modal pane's content.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div
        ref={::this.refModal}
        className="modal fade in"
        style={{ display: 'block' }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby={this.getHeader() && this.getHeader().props.titleId}
        onClick={::this.onEscape}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {this.props.children}
          </div>
          <ResizeHandle minCurrent left />
          <ResizeHandle minCurrent right />
        </div>
      </div>
    );
  }
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export Manager from './manager';
