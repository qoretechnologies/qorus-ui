/* @flow */
import React from 'react';

type Props = {
  item: any;
  type: string;
  inputMap: any;
  outputMap: any;
  rectWidth: number;
  inputOffsetY: number;
  outputOffsetY: number;
  headerHeight: number;
  rectHeight: number;
  paddingElements: number;
  svgWidth: number;
  offsetX: number;
  lineColor: string;
};

const DiagramConnection: Function = ({
  rectWidth,
  inputOffsetY,
  outputOffsetY,
  headerHeight,
  rectHeight,
  paddingElements,
  svgWidth,
  offsetX,
  inputMap,
  outputMap,
  type,
  item,
  lineColor,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isSelected' does not exist on type 'Prop... Remove this comment to see the full error message
  isSelected,
}: // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
Props) => {
  const polySize = 5;
  const [[outputValue, inputValue]]: any = Object.entries(item);
  const inputPosition = inputMap[inputValue];
  const outputPosition = outputMap[outputValue];

  switch (type) {
    case 'line':
      return (
        <line
          // $FlowIssue: wtf??
          key={`${inputValue}_to_${outputValue}`}
          x1={rectWidth + (polySize - 1) + 1}
          y1={
            inputOffsetY +
            (headerHeight + inputPosition * (rectHeight + paddingElements) + rectHeight / 2)
          }
          x2={rectWidth + rectWidth / 2 - polySize + 1}
          y2={
            outputOffsetY +
            (headerHeight + outputPosition * (rectHeight + paddingElements) + rectHeight / 2)
          }
          stroke={isSelected ? '#5c7080' : '#a9a9a9'}
        />
      );
    default: {
      const x = type === 'input-arrow' ? rectWidth : rectWidth + rectWidth / 2 - polySize;
      const pos = type === 'input-arrow' ? inputPosition : outputPosition;

      return (
        <svg
          x={x + 1}
          y={
            inputOffsetY +
            (headerHeight + pos * (rectHeight + paddingElements) + rectHeight / 2 - polySize)
          }
        >
          <polygon
            fill={isSelected ? '#5c7080' : '#a9a9a9'}
            points={`0, 0 0, ${polySize * 2} ${polySize}, ${polySize}`}
          />
        </svg>
      );
    }
  }
};

export default DiagramConnection;
