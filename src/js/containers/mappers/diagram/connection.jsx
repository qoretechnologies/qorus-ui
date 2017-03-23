/* @flow */
import React from 'react';
import pure from 'recompose/pure';

type Props = {
  item: Object,
  type: string,
  inputMap: Object,
  outputMap: Object,
  rectWidth: number,
  inputOffsetY: number,
  outputOffsetY: number,
  headerHeight: number,
  rectHeight: number,
  paddingElements: number,
  svgWidth: number,
  offsetX: number,
  lineColor: string,
}

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
}: Props): ?React.Element<any> => {
  const polySize = 5;
  const [[outputValue, inputValue]] = Object.entries(item);
  const inputPosition = inputMap[inputValue];
  const outputPosition = outputMap[outputValue];

  switch (type) {
    case 'line':
      return (
        <line
          // $FlowIssue: wtf??
          key={`${inputValue}_to_${outputValue}`}
          x1={rectWidth + (polySize - 1)}
          y1={
            inputOffsetY + (headerHeight + inputPosition *
            (rectHeight + paddingElements) + rectHeight / 2)
          }
          x2={svgWidth + offsetX - (rectWidth * 2.5) - polySize}
          y2={
            outputOffsetY + (headerHeight + outputPosition *
            (rectHeight + paddingElements) + rectHeight / 2)
          }
          stroke={lineColor}
        />
      );
    default: {
      const x = type === 'input-arrow' ?
        rectWidth :
        (svgWidth + offsetX - (rectWidth * 2.5) - polySize);
      const pos = type === 'input-arrow' ? inputPosition : outputPosition;

      return (
        <svg
          x={x}
          y={
            inputOffsetY + (headerHeight + pos *
            (rectHeight + paddingElements) + rectHeight / 2 - polySize)
          }
        >
          <polygon points={`0, 0 0, ${polySize * 2} ${polySize}, ${polySize}`} />
        </svg>
      );
    }
  }
};

export default pure(DiagramConnection);
