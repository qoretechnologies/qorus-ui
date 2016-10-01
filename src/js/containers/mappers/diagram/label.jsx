/* @flow */
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

const Label = ({
  x,
  y,
  offsetX,
  width,
  height,
  background,
  textColor,
  children,
  onMouseOver: handleMouseOver,
  onMouseOut: handleMouseOut,
  onClick: handleClick,
}: {
  x: Number | string,
  y: Number | string,
  offsetX: Number | string,
  width: Number | string,
  height: Number | string,
  background: string,
  textColor: string,
  children?: string,
  onMouseOver?: Function,
  onMouseOut?: Function,
  onClick?: Function,
}) => (
  <svg
    x={x}
    y={y}
    height={height}
    width={width}
    onMouseOver={handleMouseOver}
    onMouseOut={handleMouseOut}
    onClick={handleClick}
  >
    <rect
      x="0"
      y="0"
      height={height}
      width={width}
      fill={background}
    />
    <text
      x={offsetX}
      y="50%"
      fill={textColor}
      textAnchor="start"
      alignmentBaseline="middle"
    >
      {children}
    </text>
  </svg>
);

export default onlyUpdateForKeys(
  ['x', 'y', 'offsetX', 'width', 'height', 'background', 'textColor', 'children']
)(Label);
