/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import mapProps from 'recompose/mapProps';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';

import Header from './header';
import SelectableLabel from './selectable-label';

const getRelations = (fieldSource: Object): Array<Object> => (
  Object.entries(fieldSource).map(([key, value]: [string, any]): any => {
    const regex = /^\(\"name\"\:[\ ]+\"(\w+)\"/;
    const matching = value.match(regex);
    if (matching) {
      return { [key]: matching[1] };
    }
    return null;
  }).filter(item => item)
);

function hasRelation(array, input, output) {
  return !!array.find(item => {
    const [[outputValue, inputValue]] = Object.entries(item);
    return inputValue === input && outputValue === output;
  });
}


export const Diagramm = ({
  id,
  svgWidth,
  svgHeight,
  offsetX,
  offsetY,
  rectWidth,
  rectHeight,
  headerHeight,
  paddingElements,
  headerTextColor,
  rectBackgroundColor,
  rectSelectedBackgroundColor,
  rectTextColor,
  lineColor,
  selectedInput,
  selectedOutput,
  inputMap,
  outputMap,
  relations,
  handleInputSelected,
  handleInputUnselected,
  handleOutputSelected,
  handleOutputUnselected,
}: {
  id: string,
  svgWidth: number,
  svgHeight: number,
  offsetX: number,
  offsetY: number,
  rectWidth: number,
  rectHeight: number,
  headerHeight: number,
  paddingElements: number,
  headerTextColor: string,
  rectBackgroundColor: string,
  rectSelectedBackgroundColor: string,
  rectTextColor: string,
  lineColor: string,
  selectedInput: string,
  selectedOutput: string,
  inputMap: Object,
  outputMap: Object,
  relations: Object,
  handleInputSelected: Function,
  handleInputUnselected: Function,
  handleOutputSelected: Function,
  handleOutputUnselected: Function,
}) => (
  <div id={id} className="svg-diagramm">
    <svg height={svgHeight} width={svgWidth}>
      <Header
        textColor={headerTextColor}
        offsetX={offsetX}
        offsetY={offsetY}
        rectWidth={rectWidth}
        svgWidth={svgWidth}
        headerHeight={headerHeight}
      />

      {Object.entries(inputMap).map(([name, position]: [string, any]) => (
        <SelectableLabel
          key={`input_${name}`}
          x={offsetX}
          y={headerHeight + position * (rectHeight + paddingElements)}
          offsetX={offsetX}
          width={rectWidth}
          height={rectHeight}
          textColor={rectTextColor}
          background={
            selectedInput === name || hasRelation(relations, name, selectedOutput) ?
            rectSelectedBackgroundColor :
            rectBackgroundColor
          }
          onInputSelected={handleInputSelected}
          onInputUnselected={handleInputUnselected}
        >
          {name}
        </SelectableLabel>
      ))}

      {Object.entries(outputMap).map(([name, position]: [string, any]) => (
        <SelectableLabel
          key={`output_${name}`}
          x={svgWidth - offsetX - rectWidth}
          y={headerHeight + position * (rectHeight + paddingElements)}
          offsetX={offsetX}
          width={rectWidth}
          height={rectHeight}
          textColor={rectTextColor}
          background={
            selectedOutput === name || hasRelation(relations, selectedInput, name) ?
            rectSelectedBackgroundColor :
            rectBackgroundColor
          }
          onInputSelected={handleOutputSelected}
          onInputUnselected={handleOutputUnselected}
        >
          {name}
        </SelectableLabel>
      ))}

      {relations.map(item => {
        const [[outputValue, inputValue]] = Object.entries(item);
        const inputPosition = inputMap[inputValue];
        const outputPosition = outputMap[outputValue];

        return (
          <line
            key={`${inputValue}_to_${outputValue}`}
            x1={offsetX + rectWidth}
            y1={headerHeight + inputPosition * (rectHeight + paddingElements) + rectHeight / 2}
            x2={svgWidth - offsetX - rectWidth}
            y2={headerHeight + outputPosition * (rectHeight + paddingElements) + rectHeight / 2}
            stroke={lineColor}
          />
        );
      })}
    </svg>
  </div>);

const SVG_WIDTH = 800;
const OFFSET_X = 10;
const OFFSET_Y = 20;
const HEADER_HEIGHT = 40;
const PADDING_ELEMENTS = 5;
const RECT_HEIGHT = 20;
const RECT_WIDTH = 200;

const getFielsdMap = (source) => Object
  .keys(source)
  .map((item, idx) => [item, idx])
  .reduce(
    (prev, current) => ({ ...prev, [current[0]]: current[1] }),
    {}
  );


const getRelationsData = mapProps(props => ({
  ...props,
  inputMap: getFielsdMap(props.mapper.data.opts.input),
  outputMap: getFielsdMap(props.mapper.data.opts.output),
  relations: getRelations(props.mapper.data.field_source),
}));

const appendMaxElementCount = withProps(({ inputMap, outputMap }) => ({
  elementCount: Math.max(Object.keys(inputMap).length, Object.keys(outputMap).length),
}));

const appendDiagramParams = compose(
  withProps({
    svgWidth: SVG_WIDTH,
    rectHeight: RECT_HEIGHT,
    rectWidth: RECT_WIDTH,
    offsetX: OFFSET_X,
    offsetY: OFFSET_Y,
    paddingElements: PADDING_ELEMENTS,
    headerHeight: HEADER_HEIGHT,
    rectBackgroundColor: 'teal',
    rectSelectedBackgroundColor: 'red',
    rectTextColor: 'white',
    headerTextColor: 'black',
    lineColor: 'black',
  }),
  withProps(({ elementCount, rectHeight, paddingElements, headerHeight }) => (
    { svgHeight: elementCount * (rectHeight + paddingElements) + headerHeight }
  ))
);

const addInputSelection = compose(
  withState('selectedInput', 'setSelectedInput', null),
  withProps(({ setSelectedInput }) => ({
    handleInputSelected: input => setSelectedInput(input),
    handleInputUnselected: () => setSelectedInput(null),
  }))
);

const addOutputSelection = compose(
  withState('selectedOutput', 'setSelectedOutput', null),
  withProps(({ setSelectedOutput }) => ({
    handleOutputSelected: input => setSelectedOutput(input),
    handleOutputUnselected: () => setSelectedOutput(null),
  }))
);

export default compose(
  pure,
  getRelationsData,
  appendMaxElementCount,
  appendDiagramParams,
  addInputSelection,
  addOutputSelection
)(Diagramm);
