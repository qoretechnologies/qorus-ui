/* @flow */
import React, { Component } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';

import ResizeHandle from '../resize/handle';
import Header from './header';
import Body from './body';
import Footer from './footer';
import Manager from './manager';

import { pureRender } from '../utils';

type Props = {
  children: any,
  onMount?: Function,
  size: string,
  hasFooter?: boolean,
  height?: number,
  onResizeStop?: Function,
};

/**
 * Modal pane component.
 */
@pureRender
export default class Modal extends Component {
  static defaultProps = {
    size: '',
  };

  static Footer = null;
  static Header = null;
  static Body = null;

  props: Props;
  state: {
    height: ?number,
  } = {
    height: this.props.height || null,
  }

  componentDidMount(): void {
    if (this.props.onMount) {
      this.props.onMount();
    }

    if (this.state.height !== 'auto') {
      this.resizeBody();
    }
  }

  componentDidUpdate() {
    this.resizeBody();
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

  handleStop: Function = (width: number, height: number) => {
    if (this.props.onResizeStop) this.props.onResizeStop();

    this.setState({
      height,
    });
  }

  /**
   * Stores modal reference for later.
   *
   * @param {HTMLElement} el
   */
  refModal: Function = (el: Object): void => {
    this._modal = el;
  };

  calculateHeight: Function = (): ?number => {
    const headerHeight: number = document.querySelectorAll('.modal-header')[0].offsetHeight;

    if (this.props.hasFooter) {
      const footerHeight: number = document.querySelectorAll('.modal-footer')[0].offsetHeight;

      return this.state.height ? this.state.height - (headerHeight + footerHeight) : null;
    }

    return this.state.height ? this.state.height - headerHeight : null;
  }

  resizeBody: Function = (): void => {
    const body = document.querySelectorAll('.modal-body')[0];
    const height = this.calculateHeight();

    body.style.height = `${height}px`;
  }

  /**
   * Renders necessary elements around modal pane's content.
   *
   * @return {ReactElement}
   */
  render(): React.Element<any> {
    return (
      <Draggable
        handle=".handle"
        bounds={{ top: 0 }}
      >
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
            style={{
              height: this.state.height ? `${this.state.height}px` : 'auto',
            }}
          >
            <div className={`modal-content ${this.props.hasFooter ? 'has-footer' : ''}`}>
              {this.props.children}
            </div>
            <ResizeHandle left onStop={this.handleStop} />
            <ResizeHandle right onStop={this.handleStop} />
            <ResizeHandle bottom onStop={this.handleStop} />
            <ResizeHandle left bottom onStop={this.handleStop} />
            <ResizeHandle right bottom onStop={this.handleStop} />
          </div>
        </div>
      </Draggable>
    );
  }
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export {
  Manager,
};
