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
  <g
    x="0"
    y="0"
    height={headerHeight}
    width={svgWidth}
  >
    <text
      x={offsetX}
      y={offsetY}
      fill={textColor}
    >
      Input
    </text>
    <text
      x={svgWidth - rectWidth - offsetX}
      y={offsetY}
      fill={textColor}
    >
      Output
    </text>
  </g>
);

export default Header;
