/* @flow */
import React, { Component } from 'react';
import _Draggable from 'react-draggable';
import ResizeHandle from '../resize/handle';
import { pureRender } from '../utils';
import Body from './body';
import Footer from './footer';
import Header from './header';
import Manager from './manager';
import { ReqoreBackdrop } from '@qoretechnologies/reqore';

const Draggable: any = _Draggable;

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
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    height: number;
  } = {
    height: this.props.height || null,
  };

  componentDidMount(): void {
    if (this.props.onMount) {
      this.props.onMount();
    }

    // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message
    if (this.state.height !== 'auto') {
      this.resizeBody();
    }

    if (this.props.onEnterPress) {
      window.addEventListener('keyup', this.handleEnterKeyUp);
    }
  }

  componentDidUpdate() {
    this.resizeBody();
  }

  componentWillUnmount() {
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
  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'SyntheticEvent'.
  onEscape: Function = (ev: SyntheticEvent): void => {
    if (ev.target === this._modal && this.getHeader() && this.getHeader().props.onClose) {
      this.getHeader().props.onClose();
    }
  };

  /**
   * Finds modal Header component in children.
   *
   * @return {Header|null}
   */
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  getHeader(): any {
    return (
      React.Children.toArray(this.props.children).filter(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'ReactChild... Remove this comment to see the full error message
        (c) => c.type === Header
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
  refModal: Function = (el: any): void => {
    this._modal = el;

    if (this._modal) {
      this._modal.focus();
    }
  };

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  calculateHeight: Function = (): number => {
    const header: any = document.querySelectorAll('.bp3-dialog-header')[0];

    if (header) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'offsetHeight' does not exist on type 'Ob... Remove this comment to see the full error message
      const headerHeight: number = header.offsetHeight;
      if (this.props.hasFooter) {
        const footerHeight: number =
          // @ts-ignore ts-migrate(2339) FIXME: Property 'offsetHeight' does not exist on type 'El... Remove this comment to see the full error message
          document.querySelectorAll('.bp3-dialog-footer')[0].offsetHeight + 15;

        return this.state.height ? this.state.height - (headerHeight + footerHeight) : null;
      }

      return this.state.height ? this.state.height - headerHeight : null;
    }

    return null;
  };

  resizeBody: Function = (): void => {
    const body = document.querySelectorAll('.bp3-dialog-body')[0];

    if (body) {
      const height = this.calculateHeight();

      // @ts-ignore ts-migrate(2339) FIXME: Property 'style' does not exist on type 'Element'.
      body.style.height = `${height}px`;
    }
  };

  /**
   * Renders necessary elements around modal pane's content.
   *
   * @return {ReactElement}
   */
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render() {
    return (
      <ReqoreBackdrop>
        <div
          className={`bp3-dialog-container ${this.props.hasFooter ? 'has-footer' : ''}`}
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'LegacyR... Remove this comment to see the full error message
          ref={this.refModal}
          // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
          tabIndex="-1"
          role="dialog"
          aria-labelledby={this.getHeader() && this.getHeader().props.titleId}
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
          onMouseDown={this.onEscape}
          style={{ zIndex: 11000 }}
        >
          <Draggable handle=".handle">
            <div
              className="bp3-dialog"
              role="document"
              style={{
                width: this.props.width,
                height: this.state.height ? `${this.state.height}px` : 'auto',
                // @ts-ignore ts-migrate(2322) FIXME: Type '"relative !important"' is not assignable to ... Remove this comment to see the full error message
                position: 'relative !important',
              }}
            >
              {this.props.children}
              {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ left: true; onStop: Function; }' is missin... Remove this comment to see the full error message */}
              <ResizeHandle left onStop={this.handleStop} />
              {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ right: true; onStop: Function; }' is missi... Remove this comment to see the full error message */}
              <ResizeHandle right onStop={this.handleStop} />
              {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ bottom: true; onStop: Function; }' is miss... Remove this comment to see the full error message */}
              <ResizeHandle bottom onStop={this.handleStop} />
              {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ left: true; bottom: true; onStop: Function... Remove this comment to see the full error message */}
              <ResizeHandle left bottom onStop={this.handleStop} />
              {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ right: true; bottom: true; onStop: Functio... Remove this comment to see the full error message */}
              <ResizeHandle right bottom onStop={this.handleStop} />
            </div>
          </Draggable>
        </div>
      </ReqoreBackdrop>
    );
  }
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export { Manager };
