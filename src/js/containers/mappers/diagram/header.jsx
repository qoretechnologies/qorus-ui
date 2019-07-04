/* @flow */
import React from 'react';

const Header = ({
  headerHeight,
  rectWidth,
  svgWidth,
  offsetX,
  offsetY,
  textColor,
}: {
  headerHeight: number,
  rectWidth: number,
  svgWidth: number,
  offsetX: number,
  offsetY: number,
  textColor: string,
}) => (
  <g x="0" y="0" height={headerHeight} width={svgWidth}>
    <text x={rectWidth / 2} y={offsetY} fill={textColor} textAnchor="middle">
      Input
    </text>
    <text
      x={rectWidth + rectWidth}
      y={offsetY}
      fill={textColor}
      textAnchor="middle"
    >
      Output
    </text>
  </g>
);

export default Header;
