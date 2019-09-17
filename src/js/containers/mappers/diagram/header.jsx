/* @flow */
import React from 'react';
import { injectIntl } from 'react-intl';

const Header = ({
  headerHeight,
  rectWidth,
  svgWidth,
  offsetX,
  offsetY,
  textColor,
  intl,
}: {
  headerHeight: number,
  rectWidth: number,
  svgWidth: number,
  offsetX: number,
  offsetY: number,
  textColor: string,
}): React.Element<any> => (
  <g x="0" y="0" height={headerHeight} width={svgWidth}>
    <text x={rectWidth / 2} y={offsetY} fill={textColor} textAnchor="middle">
      {intl.formatMessage({ id: 'component.input' })}
    </text>
    <text
      x={rectWidth + rectWidth}
      y={offsetY}
      fill={textColor}
      textAnchor="middle"
    >
      {intl.formatMessage({ id: 'component.output' })}
    </text>
  </g>
);

export default injectIntl(Header);
