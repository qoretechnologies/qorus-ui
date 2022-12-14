import React, { useEffect, useRef, useState } from 'react';

import map from 'lodash/map';
import useMount from 'react-use/lib/useMount';
import ResizeObserver from 'resize-observer-polyfill';
import styled, { css } from 'styled-components';

import { IF_STATE_SIZE, STATE_HEIGHT, STATE_WIDTH } from '../../FSMDiagram';

export const getStateStyle = (type, toolbar?: boolean) => {
  switch (type) {
    case 'connector':
      return css`
        transform: skew(15deg);
        > div,
        > p,
        > span {
          transform: skew(-15deg);
        }
      `;
    case 'mapper':
      return null;
    case 'pipeline':
      return css`
        border-radius: 50px;
      `;
    case 'fsm':
      return css`
        border-style: dashed;
      `;
    case 'block':
      return css`
        border-style: dotted;
        border-radius: 10px;
        background: repeating-linear-gradient(-45deg, #fff, #fff 10px, #f3f3f3 10px, #f3f3f3 20px);
      `;
    case 'apicall':
      return css`
        border-radius: 30%;
      `;
    case 'search-single':
      return css`
        border-radius: 40% 40% 0 0;
      `;
    case 'search':
      return css`
        border-radius: 0 0 40% 40%;
      `;
    case 'update':
      return css`
        border-radius: 0 40% 40% 0;
      `;
    case 'create':
      return css`
        border-radius: 0 40% 0 40%;
      `;
    case 'delete':
      return css`
        border-style: dotted;
        border-radius: 20% 40% 20% 40%;
      `;
    case 'if':
      if (toolbar) {
        return css`
          width: 20px;
          height: 20px;
          transform: rotateZ(45deg);
          transform-origin: top left;
          margin-left: 20px;

          span:first-child {
            transform: rotateZ(-45deg);
          }
        `;
      }

      return css`
        transform: rotateZ(45deg);

        div:first-child {
          transform: rotateZ(-45deg);
        }
      `;
    default:
      return null;
  }
};

const StyledMinimapWrapper = styled.div`
  width: 200px;
  height: ${({ show }) => (show ? '200px' : '0px')};
  transition: height 0.2s ease-in-out;
  background-color: #fff;
  position: relative;
  cursor: no-drop;
`;

const StyledMinimapItem = styled.div`
  ${({ top, left, type }) => css`
    left: ${left / 10}px;
    top: ${top / 10}px;
    width: ${(type === 'if' ? IF_STATE_SIZE : STATE_WIDTH) / 10}px;
    height: ${(type === 'if' ? IF_STATE_SIZE : STATE_HEIGHT) / 10}px;
    border: 1px solid #a9a9a9;
    position: absolute;
  `}

  ${({ type }) => getStateStyle(type)}
`;

const StyledMinimapView = styled.div`
  ${({ width, height }) => css`
    width: ${width / 10}px;
    height: ${height / 10}px;
    box-shadow: inset 1px 1px 0 0 #277fba, inset -1px -1px 0 0 #277fba,
      inset 1px 1px 3px -1px #277fba, inset -1px -1px 3px -1px #277fba;
    position: absolute;
  `}

  transition: box-shadow .2s linear;

  &:hover,
  &:active,
  &:focus {
    cursor: move;
    box-shadow: inset 1px 1px 0 0 #277fba, inset -1px -1px 0 0 #277fba,
      inset 1px 1px 6px -1px #277fba, inset -1px -1px 6px -1px #277fba;
  }
`;

export interface IFSMMinimapProps {
  width: number;
  height: number;
  x: number;
  y: number;
  items?: { y: number; x: number }[];
  onDrag: (x: number, y: number) => void;
  show: boolean;
  panElementId: string;
}

const staticPosition = { x: null, y: null };

const Minimap: React.FC<IFSMMinimapProps> = ({ items, x, y, onDrag, show, panElementId }) => {
  const viewRef = useRef(null);
  const [position, setPosition] = useState({ x, y });
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  useMount(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        const el = document.querySelector(`#panElement${panElementId}`);

        if (el) {
          const { width, height } = el.getBoundingClientRect();

          setWrapperSize({
            width,
            height,
          });
        }
      });
    });

    resizeObserver.observe(document.querySelector(`#panElement${panElementId}`));

    staticPosition.x = x || 0;
    staticPosition.y = y || 0;

    return () => {
      resizeObserver.unobserve(document.querySelector(`#panElement${panElementId}`));
    };
  });

  useEffect(() => {
    setPosition({ x: x / 10, y: y / 10 });
    staticPosition.x = x / 10;
    staticPosition.y = y / 10;
  }, [x, y]);

  const onDragStart = (e) => {
    e.persist();
    e.preventDefault();
    e.stopPropagation();

    window.addEventListener('mouseup', onDragStop);
    window.addEventListener('mousemove', onDragMove);
  };

  const onDragMove = (e) => {
    const { width: viewWidth, height: viewHeight } = viewRef.current.getBoundingClientRect();

    staticPosition.x += e.movementX;
    staticPosition.y += e.movementY;

    if (staticPosition.x < 0) {
      staticPosition.x = 0;
    }

    if (staticPosition.y < 0) {
      staticPosition.y = 0;
    }

    const widthDifference = 200 - viewWidth;

    if (staticPosition.x > widthDifference) {
      staticPosition.x = widthDifference;
    }

    const heightDifference = 200 - viewHeight;

    if (staticPosition.y > heightDifference) {
      staticPosition.y = heightDifference;
    }

    viewRef.current.style.top = `${staticPosition.y}px`;
    viewRef.current.style.left = `${staticPosition.x}px`;

    onDrag(e.movementX * 10, e.movementY * 10);
  };

  const onDragStop = () => {
    window.removeEventListener('mouseup', onDragStop);
    window.removeEventListener('mousemove', onDragMove);
  };

  return (
    <StyledMinimapWrapper show={show}>
      {show && (
        <>
          {map(items, (item, index) => (
            <StyledMinimapItem key={index} top={item.y} left={item.x} type={item.type} />
          ))}
          <StyledMinimapView
            width={wrapperSize.width}
            height={wrapperSize.height}
            style={{
              top: `${position.y}px`,
              left: `${position.x}px`,
            }}
            ref={viewRef}
            onMouseDown={onDragStart}
          />
        </>
      )}
    </StyledMinimapWrapper>
  );
};

export default Minimap;
