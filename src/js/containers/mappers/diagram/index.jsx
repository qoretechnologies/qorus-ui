/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import mapProps from 'recompose/mapProps';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';

import Header from './header';
import SelectableLabel from './selectable-label';
import FieldDetail from './field-detail';
import Detail from './detail';
import Tooltip from './tooltip';

const getRelations = (fieldSource: Object, inputs: Object): Array<Object> => (
  Object.entries(fieldSource).map(([key, value]: [string, any]): any => {
    const str = value.replace(/ /g, '');
    const regex = /^\("name":+"(\w+)"/;
    const matching = str.match(regex);

    if (matching) {
      return { [key]: matching[1] };
    }

    if (inputs[key]) return { [key]: key };

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
  inputOffsetY,
  outputOffsetY,
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
  mapper,
  selectedDetail,
  handleDetailSelection,
  opts,
  tooltip,
  toggleTooltip,
}: {
  id: string,
  svgWidth: number,
  svgHeight: number,
  offsetX: number,
  offsetY: number,
  inputOffsetY: number,
  outputOffsetY: number,
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
  mapper: Object,
  selectedDetail: ?Object,
  handleDetailSelection: Function,
  opts: Object,
  tooltip: ?Object,
  toggleTooltip: Function,
}): React.Element<any> => (
  <div className="mapper-wrapper">
    <Tooltip data={tooltip} />
    <div id={id} className="svg-diagram">
      <svg height={svgHeight} width={svgWidth} id="mapper">
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
            x={0}
            y={
              inputOffsetY + (headerHeight + parseInt(position, 10) *
              (rectHeight + paddingElements))
            }
            offsetX={10}
            width={rectWidth}
            height={rectHeight}
            textColor={rectTextColor}
            details={opts.input[name]}
            background={
              selectedInput === name || hasRelation(relations, name, selectedOutput) ?
              rectSelectedBackgroundColor :
              rectBackgroundColor
            }
            toggleTooltip={toggleTooltip}
            onInputSelected={handleInputSelected}
            onInputUnselected={handleInputUnselected}
            relations={relations}
            fieldType="input"
          >
            {name}
          </SelectableLabel>
        ))}

        {Object.entries(outputMap).map(([name, position]: [string, any]) => (
          <SelectableLabel
            key={`output_${name}`}
            x={svgWidth + offsetX - (rectWidth * 2.5)}
            y={
              outputOffsetY + (headerHeight + parseInt(position, 10) *
              (rectHeight + paddingElements))
            }
            offsetX={10}
            width={rectWidth}
            height={rectHeight}
            textColor={rectTextColor}
            details={opts.output[name]}
            background={
              selectedOutput === name || hasRelation(relations, selectedInput, name) ?
              rectSelectedBackgroundColor :
              rectBackgroundColor
            }
            toggleTooltip={toggleTooltip}
            onInputSelected={handleOutputSelected}
            onInputUnselected={handleOutputUnselected}
            relations={relations}
            fieldType="output"
          >
            {name}
          </SelectableLabel>
        ))}

        {Object.entries(outputMap).map(([name, position]: [string, any]) => (
          <foreignObject
            key={name}
            x={svgWidth + offsetX - (rectWidth * 1.5)}
            y={
              outputOffsetY + (headerHeight + parseInt(position, 10) *
              (rectHeight + paddingElements))
            }
            offsetX={offsetX}
            width={rectWidth}
            height={rectHeight}
            style={{ overflow: 'hidden' }}
          >
            <FieldDetail
              name={name}
              onShowAll={handleDetailSelection}
              fieldSource={mapper.field_source[name]}
            />
          </foreignObject>
        ))}

        {relations.map(item => {
          const [[outputValue, inputValue]] = Object.entries(item);
          const inputPosition = inputMap[inputValue];
          const outputPosition = outputMap[outputValue];

          return (
            <line
              // $FlowIssue: wtf??
              key={`${inputValue}_to_${outputValue}`}
              x1={rectWidth}
              y1={
                inputOffsetY + (headerHeight + inputPosition *
                (rectHeight + paddingElements) + rectHeight / 2)
              }
              x2={svgWidth + offsetX - (rectWidth * 2.5)}
              y2={
                outputOffsetY + (headerHeight + outputPosition *
                (rectHeight + paddingElements) + rectHeight / 2)
              }
              stroke={lineColor}
            />
          );
        })}
      </svg>
    </div>
    {selectedDetail && (
      <div className="mapper-detail" id="detail">
        <Detail
          data={selectedDetail}
          onClose={handleDetailSelection}
        />
      </div>
    )}
  </div>
);

const SVG_WIDTH = 720;
const OFFSET_X = 90;
const OFFSET_Y = 20;
const HEADER_HEIGHT = 40;
const PADDING_ELEMENTS = 5;
const RECT_HEIGHT = 45;
const RECT_WIDTH = 200;

const getFielsdMap = (source) => Object
  .keys(source)
  .map((item, idx) => [item, idx])
  .reduce((prev, current) => ({ ...prev, [current[0]]: current[1] }), {});

const getRelationsData = mapProps(props => ({
  ...props,
  inputMap: getFielsdMap(props.mapper.opts.input),
  outputMap: getFielsdMap(props.mapper.opts.output),
  relations: getRelations(props.mapper.field_source, props.mapper.opts.input),
  opts: props.mapper.opts,
}));

const appendMaxElementCount = withProps(({ inputMap, outputMap }) => ({
  inputCount: Object.keys(inputMap).length,
  outputCount: Object.keys(outputMap).length,
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
    rectBackgroundColor: '#9ccb3b',
    rectSelectedBackgroundColor: '#729C1C',
    rectTextColor: 'white',
    headerTextColor: 'black',
    lineColor: 'black',
  }),
  withProps(({ elementCount, rectHeight, paddingElements, headerHeight }) => ({
    svgHeight: elementCount * (rectHeight + paddingElements) + headerHeight + OFFSET_Y * 2,
  })),
  withProps(({ svgHeight, inputCount, outputCount, rectHeight, paddingElements }) => ({
    inputOffsetY: (svgHeight - (inputCount * (rectHeight + paddingElements))) / 2,
    outputOffsetY: (svgHeight - (outputCount * (rectHeight + paddingElements))) / 2,
  }))
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

const setDetail = compose(
  withState('selectedDetail', 'setSelectedDetail', null),
  withProps(({ setSelectedDetail }) => ({
    handleDetailSelection: detail => setSelectedDetail(detail),
  }))
);

const toggleTooltip = compose(
  withState('tooltip', 'detailToggler', null),
  withProps(({ detailToggler }) => ({
    toggleTooltip: detail => detailToggler(detail),
  }))
);

export default compose(
  pure,
  getRelationsData,
  appendMaxElementCount,
  appendDiagramParams,
  addInputSelection,
  addOutputSelection,
  setDetail,
  toggleTooltip,
)(Diagramm);
