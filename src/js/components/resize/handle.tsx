// @flow
import { Icon } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { Component } from 'react';

/**
 * Top handle position.
 */
const TOP = 0b0001;

/**
 * Right handle position.
 */
const RIGHT = 0b0010;

/**
 * Bottom handle position.
 */
const BOTTOM = 0b0100;

/**
 * Left handle position.
 */
const LEFT = 0b1000;

/**
 * Resize handle to change parent element's dimensions.
 *
 * It expects that parent element is absolutely positioned element
 * relative to current viewport (yes it is quite limiting and yes
 * current implementation can be further generalized). It should be
 * placed as the last child to make sure it reachable by mouse.
 *
 * It is possible to limit resizability to dimensions as initially
 * rendered by setting `minCurrent` prop.
 *
 * Available handle positions are the following: top-left, top,
 * top-right, right, bottom-right, bottom, bottom-left, left. Any
 * other combination throws an error before render.
 */
export default class Handle extends Component {
  props: {
    minCurrent: boolean;
    min: Object;
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
    onStart: Function;
    onStop: Function;
    children: any;
  } = this.props;

  static defaultProps = {
    minCurrent: false,
    min: {
      width: 400,
      height: 200,
    },
    top: false,
    right: false,
    bottom: false,
    left: false,
  };

  /**
   * Initializes internal state.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
    this._handle = null;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    this._position = 0;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
    this._min = null;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_resizeListener' does not exist on type ... Remove this comment to see the full error message
    this._resizeListener = null;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_stopListener' does not exist on type 'H... Remove this comment to see the full error message
    this._stopListener = null;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_originalCursor' does not exist on type ... Remove this comment to see the full error message
    this._originalCursor = null;
  }

  /**
   * Detects current position from props.
   *
   * @see getDirection
   */
  componentWillMount() {
    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    this._position = this.getDirection(this.props);
  }

  /**
   * Finds current minimal dimensions if needed.
   *
   * @see getMinimalDimensions
   */
  componentDidMount() {
    // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
    this._min = this.getMinimalDimensions(this.props);
  }

  /**
   * Re-detects position and finds minimal dimensions for next props.
   *
   * @param {Object} nextProps
   * @see getDirection
   * @see getMinimalDimensions
   */
  componentWillReceiveProps(nextProps) {
    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    this._position = this.getDirection(nextProps);
    // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
    this._min = this.getMinimalDimensions(nextProps);
  }

  /**
   * Cleans up global event listener and styles.
   *
   * @see stop
   */
  componentWillUnmount() {
    this.stop(null);
  }

  /**
   * Validates position and returns single representation of it.
   *
   * @param {object} props
   * @return {number} bitwise OR from TOP, RIGHT, BOTTOM and LEFT
   * @see TOP
   * @see RIGHT
   * @see BOTTOM
   * @see LEFT
   */
  getDirection(props) {
    if (!props.top && !props.right && !props.bottom && !props.left) {
      throw new Error('Must set at least one of top, right, bottom or left props');
    }
    if (props.top && props.bottom) {
      throw new Error('Cannot set both top and bottom props');
    }
    if (props.left && props.right) {
      throw new Error('Cannot set both left and right props');
    }

    let direction = 0b0;
    if (props.top) direction = direction | TOP;
    if (props.right) direction = direction | RIGHT;
    if (props.bottom) direction = direction | BOTTOM;
    if (props.left) direction = direction | LEFT;

    return direction;
  }

  /**
   * Returns minimal dimensions which limit resizing.
   *
   * @param {object} props
   * @return {DOMRect|object}
   */
  getMinimalDimensions(props: any) {
    let min;

    if (props.minCurrent) {
      min = this.getParentRect();
    } else if (props.min) {
      min = props.min;
    } else {
      min = {};
    }

    return min;
  }

  /**
   * Finds parent element's bounding border box.
   *
   * This method can called before elements are rendered in which case
   * it returns `null`.
   *
   * @return {DOMRect|null}
   */
  getParentRect() {
    return (
      // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
      this._handle &&
      // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
      this._handle.parentElement &&
      // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
      this._handle.parentElement.getBoundingClientRect()
    );
  }

  /**
   * Checks if current dimensions are minimal.
   *
   * If the components has not been mounted yet and `minCurrent` prop
   * is set, it return `true` because the initial dimensions are
   * minimal in such case.
   *
   * @return {boolean}
   */
  isMin() {
    const rect = this.getParentRect();
    if (!rect && this.props.minCurrent) return true;

    let is = false;

    // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
    if (rect && this._min.height && this._position & (TOP | BOTTOM)) {
      // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
      is = this._min.height >= rect.height;
    }
    // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
    if (rect && this._min.width && this._position & (LEFT | RIGHT)) {
      is = is
        ? // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
          is && this._min.width >= rect.width
        : // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
          this._min.width >= rect.width;
    }

    return is;
  }

  /**
   * Starts resize by attaching `mousemove` and `mouseup` handlers.
   *
   * The {@link resize} method is the `mousemove` handler. The {@link
   * stop} method as the mouseup handler. The handlers are attached to
   * document body because mousemove often occurs outside of bouding
   * border box of handle and mouseup can potentially too.
   *
   * @param {MouseEvent} ev
   */
  start = (ev) => {
    ev.preventDefault();

    // @ts-ignore ts-migrate(2339) FIXME: Property '_resizeListener' does not exist on type ... Remove this comment to see the full error message
    this._resizeListener = this.resize;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
    this._handle.ownerDocument.addEventListener(
      'mousemove',
      // @ts-ignore ts-migrate(2339) FIXME: Property '_resizeListener' does not exist on type ... Remove this comment to see the full error message
      this._resizeListener,
      false
    );

    // @ts-ignore ts-migrate(2339) FIXME: Property '_stopListener' does not exist on type 'H... Remove this comment to see the full error message
    this._stopListener = this.stop;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
    this._handle.ownerDocument.addEventListener(
      'mouseup',
      // @ts-ignore ts-migrate(2339) FIXME: Property '_stopListener' does not exist on type 'H... Remove this comment to see the full error message
      this._stopListener,
      false
    );

    // @ts-ignore ts-migrate(2339) FIXME: Property '_originalCursor' does not exist on type ... Remove this comment to see the full error message
    this._originalCursor = this._handle.ownerDocument.body.style.cursor;
  };

  /**
   * Resizes the parent element by setting new style properties.
   *
   * It ensures that dimensions do not go below minimal dimensions if
   * they are set (currently only by setting `minCurrent` prop).
   *
   * If minimal dimensions are reached, the `min` class is set on
   * handle. Otherwise, it is removed.
   *
   * To provide predictable experience, handle's `cursor` style
   * property is copied to the document body. When enlarging the
   * parent element, the mouse cursor goes beyond element's bounding
   * border box and it would therefore lose its resizing visual
   * representation of what is happening while mouse button is down.
   *
   * @param {MouseEvent} ev
   */
  resize = (ev) => {
    ev.preventDefault();

    const style = this.computeNewStyle(ev);

    // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
    if (this._min.height > style.height) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'height' does not exist on type '{}'.
      style.height = this._min.height;
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property '_min' does not exist on type 'Handle'.
    if (this._min.width > style.width) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'width' does not exist on type '{}'.
      style.width = this._min.width;
    }

    Object.keys(style).forEach((cssProp) => {
      // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
      this._handle.parentElement.style[cssProp] = `${style[cssProp]}px`;
    });

    if (this.isMin()) {
      // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
      this._handle.classList.add('min');
    } else {
      // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
      this._handle.classList.remove('min');
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
    this._handle.ownerDocument.body.style.cursor = window.getComputedStyle(
      // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
      this._handle
    ).cursor;
  };

  /**
   * Computes new new style properties for handle's parent element.
   *
   * It uses parent element's bounding border box, mouse position from
   * given event and handler's position to compute the new properties.
   *
   * It does not check computed properties against minimal dimensions.
   *
   * @param {MouseEvent} ev
   * @return {object}
   */
  computeNewStyle(ev) {
    const style = {};
    const rect = this.getParentRect();

    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    if (this._position & TOP) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'height' does not exist on type '{}'.
      style.height = rect.top - ev.clientY + rect.height;
      // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    } else if (this._position & BOTTOM) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'height' does not exist on type '{}'.
      style.height = ev.clientY - rect.top;
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    if (this._position & LEFT) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'width' does not exist on type '{}'.
      style.width = rect.left - ev.clientX + rect.width;
      // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    } else if (this._position & RIGHT) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'width' does not exist on type '{}'.
      style.width = ev.clientX - rect.left;
    }

    return style;
  }

  /**
   * Removes `mousemove` and `mouseup` handlers and resets the cursor.
   *
   * @param {?MouseEvent} ev
   */
  stop = (ev) => {
    if (ev) ev.preventDefault();

    if (this.props.onStop) {
      this.props.onStop(
        // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
        this._handle.parentElement.offsetWidth,
        // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
        this._handle.parentElement.offsetHeight
      );
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
    this._handle.ownerDocument.body.style.cursor = this._originalCursor;

    // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
    this._handle.ownerDocument.removeEventListener(
      'mousemove',
      // @ts-ignore ts-migrate(2339) FIXME: Property '_resizeListener' does not exist on type ... Remove this comment to see the full error message
      this._resizeListener,
      false
    );
    // @ts-ignore ts-migrate(2339) FIXME: Property '_resizeListener' does not exist on type ... Remove this comment to see the full error message
    this._resizeListener = null;

    // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
    this._handle.ownerDocument.removeEventListener(
      'mouseup',
      // @ts-ignore ts-migrate(2339) FIXME: Property '_stopListener' does not exist on type 'H... Remove this comment to see the full error message
      this._stopListener,
      false
    );
    // @ts-ignore ts-migrate(2339) FIXME: Property '_stopListener' does not exist on type 'H... Remove this comment to see the full error message
    this._stopListener = null;
  };

  /**
   * References handle element for later.
   *
   * @param {HTMLElement} el
   */
  refHandle = (el) => {
    // @ts-ignore ts-migrate(2339) FIXME: Property '_handle' does not exist on type 'Handle'... Remove this comment to see the full error message
    this._handle = el;
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    const top = this._position & TOP;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    const right = this._position & RIGHT;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    const bottom = this._position & BOTTOM;
    // @ts-ignore ts-migrate(2339) FIXME: Property '_position' does not exist on type 'Handl... Remove this comment to see the full error message
    const left = this._position & LEFT;

    return (
      <div
        className={classNames({
          'resize-handle': true,
          min: this.isMin(),
          top,
          right,
          bottom,
          left,
        })}
        onMouseDown={this.start}
        ref={this.refHandle}
        aria-hidden="true"
      >
        <Icon
          // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
          icon={`drag-handle-${left || right ? 'vertical' : 'horizontal'}`}
        />
        {this.props.children}
      </div>
    );
  }
}
