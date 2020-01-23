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

  props: any = this.props;
  state: {
    height: ?number,
  } = {
    height: this.props.height || null,
  };

  componentDidMount (): void {
    if (this.props.onMount) {
      this.props.onMount();
    }

    if (this.state.height !== 'auto') {
      this.resizeBody();
    }

    if (this.props.onEnterPress) {
      window.addEventListener('keyup', this.handleEnterKeyUp);
    }
  }

  componentDidUpdate () {
    this.resizeBody();
  }

  componentWillUnmount () {
    if (this.props.onEnterPress) {
      window.removeEventListener('keyup', this.handleEnterKeyUp);
    }
  }

  handleEnterKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.props.onEnterPress(event);
    }
  };

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
    if (
      ev.target === this._modal &&
      this.getHeader() &&
      this.getHeader().props.onClose
    ) {
      this.getHeader().props.onClose();
    }
  };

  /**
   * Finds modal Header component in children.
   *
   * @return {Header|null}
   */
  getHeader (): React.Element<any> {
    return (
      React.Children.toArray(this.props.children).filter(
        c => c.type === Header
      )[0] || null
    );
  }

  handleStop: Function = (width: number, height: number) => {
    if (this.props.onResizeStop) this.props.onResizeStop();

    this.setState({
      height,
    });
  };

  /**
   * Stores modal reference for later.
   *
   * @param {HTMLElement} el
   */
  refModal: Function = (el: Object): void => {
    this._modal = el;

    if (this._modal) {
      this._modal.focus();
    }
  };

  calculateHeight: Function = (): ?number => {
    const header: Object = document.querySelectorAll('.bp3-dialog-header')[0];

    if (header) {
      const headerHeight: number = header.offsetHeight;
      if (this.props.hasFooter) {
        const footerHeight: number =
          document.querySelectorAll('.bp3-dialog-footer')[0].offsetHeight + 15;

        return this.state.height
          ? this.state.height - (headerHeight + footerHeight)
          : null;
      }

      return this.state.height ? this.state.height - headerHeight : null;
    }

    return null;
  };

  resizeBody: Function = (): void => {
    const body = document.querySelectorAll('.bp3-dialog-body')[0];

    if (body) {
      const height = this.calculateHeight();

      body.style.height = `${height}px`;
    }
  };

  /**
   * Renders necessary elements around modal pane's content.
   *
   * @return {ReactElement}
   */
  render (): React.Element<any> {
    return (
      <div
        className={`bp3-dialog-container ${
          this.props.hasFooter ? 'has-footer' : ''
        }`}
        ref={this.refModal}
        tabIndex="-1"
        role="dialog"
        aria-labelledby={this.getHeader() && this.getHeader().props.titleId}
        onMouseDown={this.onEscape}
      >
        <Draggable handle=".handle">
          <div
            className="bp3-dialog"
            role="document"
            style={{
              width: this.props.width,
              height: this.state.height ? `${this.state.height}px` : 'auto',
              position: 'relative !important',
            }}
          >
            {this.props.children}
            <ResizeHandle left onStop={this.handleStop} />
            <ResizeHandle right onStop={this.handleStop} />
            <ResizeHandle bottom onStop={this.handleStop} />
            <ResizeHandle left bottom onStop={this.handleStop} />
            <ResizeHandle right bottom onStop={this.handleStop} />
          </div>
        </Draggable>
      </div>
    );
  }
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export { Manager };
