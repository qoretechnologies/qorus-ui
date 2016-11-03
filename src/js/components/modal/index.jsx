/* @flow */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import ResizeHandle from '../resize/handle';
import Header from './header';
import Body from './body';
import Footer from './footer';
import Manager from './manager';

import { pureRender } from '../utils';

/**
 * Modal pane component.
 */
@pureRender
export default class Modal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onMount: PropTypes.func,
    size: PropTypes.string,
  };

  static defaultProps = {
    size: '',
  }

  static Footer = null;
  static Header = null;
  static Body = null;

  componentDidMount(): void {
    if (this.props.onMount) {
      this.props.onMount();
    }
  }

  _modal = null;

  /**
   * Triggers modal's header `onClose` prop if available.
   *
   * It also checks that event has been fired directly on modal
   * element and not on modal dialog or any of its descendants.
   *
   * @param {Event} ev
   */
  onEscape: Function = (ev: SyntheticEvent): void => {
    if (ev.target === this._modal &&
        this.getHeader() && this.getHeader().props.onClose) {
      this.getHeader().props.onClose();
    }
  };

  /**
   * Finds modal Header component in children.
   *
   * @return {Header|null}
   */
  getHeader(): React.Element<any> {
    return React.Children.toArray(this.props.children).filter(c => (
      c.type === Header
    ))[0] || null;
  }

  /**
   * Stores modal reference for later.
   *
   * @param {HTMLElement} el
   */
  refModal: Function = (el: Object): void => {
    this._modal = el;
  };

  /**
   * Renders necessary elements around modal pane's content.
   *
   * @return {ReactElement}
   */
  render(): React.Element<any> {
    return (
      <div
        ref={this.refModal}
        className="modal fade in"
        style={{ display: 'block' }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby={this.getHeader() && this.getHeader().props.titleId}
        onMouseDown={this.onEscape}
      >
        <div
          className={classNames({
            'modal-dialog': true,
            'modal-lg': this.props.size === 'lg',
            'modal-sm': this.props.size === 'sm',
          })}
          role="document"
        >
          <div className="modal-content">
            {this.props.children}
          </div>
          <ResizeHandle minCurrent left />
          <ResizeHandle minCurrent right />
          <ResizeHandle minCurrent bottom />
        </div>
      </div>
    );
  }
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export {
  Manager,
};
