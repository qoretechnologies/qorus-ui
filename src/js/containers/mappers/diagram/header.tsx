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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ headerHe... Remove this comment to see the full error message
  intl,
}: {
  headerHeight: number,
  rectWidth: number,
  svgWidth: number,
  offsetX: number,
  offsetY: number,
  textColor: string,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
