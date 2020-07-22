import React, {
  useEffect, useRef, useState
} from 'react';

import map from 'lodash/map';
import useMount from 'react-use/lib/useMount';
import ResizeObserver from 'resize-observer-polyfill';
import styled, { css } from 'styled-components';

const StyledMinimapWrapper = styled.div`
  width: 200px;
  height: ${({ show }) => (show ? '200px' : '0px')};
  transition: height 0.2s ease-in-out;
  background-color: #fff;
  position: relative;
  cursor: no-drop;
`;

const StyledMinimapItem = styled.div`
  ${({ top, left }) => css`
    left: ${left / 10}px;
    top: ${top / 10}px;
    width: 18px;
    height: 5px;
    border: 1px solid #a9a9a9;
    position: absolute;
  `}
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
  items?: { y: number, x: number }[];
  onDrag: (x: number, y: number) => void;
  show: boolean;
}

const staticPosition = { x: null, y: null };

const Minimap: React.FC<IFSMMinimapProps> = ({ items, x, y, onDrag, show }) => {
  const viewRef = useRef(null);
  const [position, setPosition] = useState({ x, y });
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  useMount(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        const el = document.querySelector('#pan-element');

        if (el) {
          const { width, height } = el.getBoundingClientRect();

          setWrapperSize({
            width,
            height,
          });
        }
      });
    });

    resizeObserver.observe(document.querySelector('#pan-element'));

    staticPosition.x = x || 0;
    staticPosition.y = y || 0;

    return () => {
      resizeObserver.unobserve(document.querySelector('#pan-element'));
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
    const {
      width: viewWidth,
      height: viewHeight,
    } = viewRef.current.getBoundingClientRect();

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
            <StyledMinimapItem key={index} top={item.y} left={item.x} />
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
