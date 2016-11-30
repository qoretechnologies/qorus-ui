import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

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
  static propTypes = {
    minCurrent: PropTypes.bool,
    min: PropTypes.object,
    top: PropTypes.bool,
    right: PropTypes.bool,
    bottom: PropTypes.bool,
    left: PropTypes.bool,
    onStart: PropTypes.func,
    onStop: PropTypes.func,
    children: PropTypes.any,
  };

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

    this._handle = null;
    this._position = 0;
    this._min = null;
    this._resizeListener = null;
    this._stopListener = null;
    this._originalCursor = null;
  }

  /**
   * Detects current position from props.
   *
   * @see getDirection
   */
  componentWillMount() {
    this._position = this.getDirection(this.props);
  }

  /**
   * Finds current minimal dimensions if needed.
   *
   * @see getMinimalDimensions
   */
  componentDidMount() {
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
    this._position = this.getDirection(nextProps);
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
      throw new Error(
        'Must set at least one of top, right, bottom or left props'
      );
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
  getMinimalDimensions(props) {
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
    return this._handle &&
      this._handle.parentElement &&
      this._handle.parentElement.getBoundingClientRect();
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

    if (rect && this._min.height && this._position & (TOP | BOTTOM)) {
      is = this._min.height >= rect.height;
    }
    if (rect && this._min.width && this._position & (LEFT | RIGHT)) {
      is = is ?
        (is && this._min.width >= rect.width) :
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

    this._resizeListener = this.resize;
    this._handle.ownerDocument.addEventListener(
      'mousemove',
      this._resizeListener,
      false
    );

    this._stopListener = this.stop;
    this._handle.ownerDocument.addEventListener(
      'mouseup',
      this._stopListener,
      false
    );

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

    if (this._min.height > style.height) {
      style.height = this._min.height;
    }

    if (this._min.width > style.width) {
      style.width = this._min.width;
    }

    Object.keys(style).forEach(cssProp => {
      this._handle.parentElement.style[cssProp] = `${style[cssProp]}px`;
    });

    if (this.isMin()) {
      this._handle.classList.add('min');
    } else {
      this._handle.classList.remove('min');
    }

    this._handle.ownerDocument.body.style.cursor =
      window.getComputedStyle(this._handle).cursor;
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

    if (this._position & TOP) {
      style.height = rect.top - ev.clientY + rect.height;
    } else if (this._position & BOTTOM) {
      style.height = ev.clientY - rect.top;
    }

    if (this._position & LEFT) {
      style.width = rect.left - ev.clientX + rect.width;
    } else if (this._position & RIGHT) {
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
        this._handle.parentElement.offsetWidth,
        this._handle.parentElement.offsetHeight
      );
    }

    this._handle.ownerDocument.body.style.cursor = this._originalCursor;

    this._handle.ownerDocument.removeEventListener(
      'mousemove',
      this._resizeListener,
      false
    );
    this._resizeListener = null;

    this._handle.ownerDocument.removeEventListener(
      'mouseup',
      this._stopListener,
      false
    );
    this._stopListener = null;
  };

  /**
   * References handle element for later.
   *
   * @param {HTMLElement} el
   */
  refHandle = (el) => {
    this._handle = el;
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div
        className={classNames({
          'resize-handle': true,
          min: this.isMin(),
          top: this._position & TOP,
          right: this._position & RIGHT,
          bottom: this._position & BOTTOM,
          left: this._position & LEFT,
        })}
        onMouseDown={this.start}
        ref={this.refHandle}
        aria-hidden="true"
      >
        {this.props.children}
      </div>
    );
  }
}
