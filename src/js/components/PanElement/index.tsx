import { Button, ButtonGroup, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import shortid from 'shortid';
import styled, { css } from 'styled-components';
import Minimap from './minimap';

const eventListener = require('eventlistener');

export interface ElementPanState {
  dragging: boolean;
  elHeight: number;
  elWidth: number;
  startX: number;
  startY: number;
  scrollX: number;
  scrollY: number;
  baseScrollX: number;
  baseScrollY: number;
  maxX: number;
  maxY: number;
  showMinimap: boolean;
  showToolbar: boolean;
}

const StyledToolbar = styled.div`
  position: absolute;
  width: 202px;
  display: flex;
  flex-flow: column;
  right: 15px;
  top: 15px;
  z-index: 10;
  border: 1px solid #c3c3c3;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const StyledToolbarActions = styled.div`
  width: 200px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #f2f2f2;

  ${({ show }) =>
    show &&
    css`
      border-bottom: 1px solid #c3c3c3;
    `}

  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-weight: 500;
    margin: 0;
    padding: 0 10px;
  }
`;

let timeout;

class _ElementPan extends React.Component<
  {
    className?: string;
    onPanStart?: (e?: ElementPanState) => void;
    onPan?: (coords?: { x: number; y: number }) => void;
    onPanStop?: (coords?: { x: number; y: number }) => void;
    enableDragging?: boolean;
    startX?: number;
    startY?: number;
    width?: number;
    height?: number;
    refElem?: (el: HTMLDivElement) => void;
    style?: {
      [key: string]: any;
    };
    zoom: number;
    items?: { y: number; x: number }[];
    panElementId?: string;
  },
  ElementPanState
> {
  el: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      elHeight: 0,
      elWidth: 0,
      startX: 0,
      startY: 0,
      scrollX: 0,
      scrollY: 0,
      baseScrollX: 0,
      baseScrollY: 0,
      maxX: 0,
      maxY: 0,
      showMinimap: true,
      showToolbar: true,
      // @ts-ignore ts-migrate(2322) FIXME: Type '{ dragging: false; elHeight: number; elWidth... Remove this comment to see the full error message
      panElementId: shortid.generate(),
    };
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
    this.ref = this.ref.bind(this);
  }

  onDragStart(e) {
    // We want to be able to pan around inside the container even when the
    // mouse is on the outside of the element (as long as the mouse button
    // is still being pressed) - this is why we're attaching to the window
    eventListener.add(window, 'mousemove', this.onDragMove);
    eventListener.add(window, 'touchmove', this.onDragMove);
    eventListener.add(window, 'mouseup', this.onDragStop);
    eventListener.add(window, 'touchend', this.onDragStop);

    // If we have multiple child nodes, use the scroll[Height/Width]
    // If we have no child-nodes, use bounds to find size of inner content
    var bounds;

    var target = e.currentTarget || e.target;
    if (target.childNodes.length > 1) {
      bounds = { width: target.scrollWidth, height: target.scrollHeight };
    } else {
      bounds = e.target.getBoundingClientRect();
    }

    // Find start position of drag based on touch/mouse coordinates
    var startX = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX;

    var startY = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;

    var state = {
      dragging: true,

      elHeight: this.el.clientHeight,
      elWidth: this.el.clientWidth,

      startX: startX,
      startY: startY,

      scrollX: this.el.scrollLeft,
      scrollY: this.el.scrollTop,

      baseScrollX: this.el.scrollLeft,
      baseScrollY: this.el.scrollTop,

      maxX: bounds.width,
      maxY: bounds.height,
    };

    this.setState(state);

    if (this.props.onPanStart) {
      // @ts-ignore ts-migrate(2345) FIXME: Argument of type '{ dragging: boolean; elHeight: n... Remove this comment to see the full error message
      this.props.onPanStart(state);
    }
  }

  onDragMove(e) {
    e.preventDefault();

    if (!this.state.dragging) {
      return;
    }

    var x = typeof e.clientX === 'undefined' ? e.changedTouches[0].clientX : e.clientX;

    var y = typeof e.clientY === 'undefined' ? e.changedTouches[0].clientY : e.clientY;

    // Letting the browser automatically stop on scrollHeight
    // gives weird bugs where some extra pixels are showing.
    // Substracting the height/width of the container from the
    // inner content seems to do the trick.
    this.el.scrollLeft = Math.min(
      this.state.maxX - this.state.elWidth,
      this.state.baseScrollX - (x - this.state.startX)
    );

    this.el.scrollTop = Math.min(
      this.state.maxY - this.state.elHeight,
      this.state.baseScrollY - (y - this.state.startY)
    );

    if (this.props.onPan) {
      this.props.onPan({ x: this.el.scrollLeft, y: this.el.scrollTop });
    }

    if (!timeout) {
      this.setState({
        scrollX: this.el.scrollLeft,
        scrollY: this.el.scrollTop,
      });
      timeout = setTimeout(() => {
        timeout = null;
      }, 16);
    }
  }

  handleMinimapMove = (x, y) => {
    this.el.scrollTop += y;
    this.el.scrollLeft += x;

    this.setState({ scrollX: this.el.scrollLeft, scrollY: this.el.scrollTop });

    if (this.props.onPan) {
      this.props.onPan({ x: this.el.scrollLeft, y: this.el.scrollTop });
    }
  };

  onDragStop() {
    this.setState({ dragging: false });

    eventListener.remove(window, 'mousemove', this.onDragMove);
    eventListener.remove(window, 'touchmove', this.onDragMove);
    eventListener.remove(window, 'mouseup', this.onDragStop);
    eventListener.remove(window, 'touchend', this.onDragStop);

    this.setState({ scrollX: this.el.scrollLeft, scrollY: this.el.scrollTop });

    if (this.props.onPanStop) {
      this.props.onPanStop({ x: this.el.scrollLeft, y: this.el.scrollTop });
    }
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    let state = {};

    if (this.props.startX) {
      this.el.scrollLeft = this.props.startX;
      // @ts-ignore ts-migrate(2339) FIXME: Property 'scrollX' does not exist on type '{}'.
      state.scrollX = this.el.scrollLeft;
    }

    if (this.props.startY) {
      this.el.scrollTop = this.props.startY;
      // @ts-ignore ts-migrate(2339) FIXME: Property 'scrollY' does not exist on type '{}'.
      state.scrollY = this.el.scrollTop;
    }

    this.setState(state);
  };

  getContainerStyles(): any {
    let style: any = {
      overflow: 'hidden',
      cursor: this.props.enableDragging ? 'move' : 'initial',
    };

    if (this.props.width) {
      style.width = this.props.width;
    }

    if (this.props.height) {
      style.height = this.props.height;
    }

    if (this.props.style) {
      style = { ...style, ...this.props.style };
    }

    return style;
  }

  ref(el: HTMLDivElement) {
    if (el) {
      if (this.props.refElem) this.props.refElem(el);
      this.el = el;
      this.setState({ showMinimap: true });
    }
  }

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const t = (id) => this.props.intl.formatMessage({ id });
    // @ts-ignore ts-migrate(2339) FIXME: Property 'panElementId' does not exist on type 'Re... Remove this comment to see the full error message
    const { panElementId } = this.state;

    return (
      <div
        ref={this.ref}
        className={this.props.className || 'element-pan'}
        style={this.getContainerStyles()}
        onTouchStart={this.props.enableDragging && this.onDragStart}
        onMouseDown={this.props.enableDragging && this.onDragStart}
        id={`panElement${panElementId}`}
      >
        {this.props.children}
        {this.state.showToolbar ? (
          <StyledToolbar draggable id="pan-element-toolbar">
            <StyledToolbarActions show={this.state.showMinimap}>
              <p>{t('global.toolbar')}</p>
              <ButtonGroup minimal>
                <Tooltip content={t('global.recenter')}>
                  <Button icon="zoom-to-fit" onClick={this.init} />
                </Tooltip>
                <Tooltip content={t('global.toggle-minimap')}>
                  <Button
                    icon="map"
                    onClick={() => this.setState({ showMinimap: !this.state.showMinimap })}
                    intent={this.state.showMinimap ? 'primary' : 'none'}
                  />
                </Tooltip>
                <Tooltip content={t('global.toggle-toolbar')}>
                  <Button
                    icon="eye-off"
                    onClick={() => this.setState({ showToolbar: false })}
                    intent="primary"
                  />
                </Tooltip>
              </ButtonGroup>
            </StyledToolbarActions>
            <Minimap
              show={this.state.showMinimap}
              items={this.props.items}
              x={this.state.scrollX}
              y={this.state.scrollY}
              width={this.el?.getBoundingClientRect().width}
              height={this.el?.getBoundingClientRect().height}
              onDrag={this.handleMinimapMove}
              panElementId={panElementId}
            />
          </StyledToolbar>
        ) : (
          <ButtonGroup
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              zIndex: 500,
            }}
            id="pan-element-toolbar"
          >
            <Tooltip content={t('global.toggle-toolbar')}>
              <Button
                icon="eye-open"
                onClick={() => this.setState({ showToolbar: true })}
                intent="none"
              />
            </Tooltip>
          </ButtonGroup>
        )}
      </div>
    );
  }
}

export const ElementPan = compose(injectIntl)(_ElementPan);
