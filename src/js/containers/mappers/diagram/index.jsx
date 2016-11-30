/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import mapProps from 'recompose/mapProps';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';
import includes from 'lodash/includes';

import Header from './header';
import SelectableLabel from './selectable-label';
import FieldDetail from './field-detail';
import Detail from './detail';
import Tooltip from './tooltip';
import Connection from './connection';
import { formatFieldSource } from '../../../helpers/mapper';

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

        {inputMap.map((inp) => (
          <SelectableLabel
            key={`input_${inp.name}`}
            x={0}
            y={
              inputOffsetY + (headerHeight + parseInt(inp.position, 10) *
              (rectHeight + paddingElements))
            }
            offsetX={10}
            width={rectWidth}
            height={rectHeight}
            textColor={rectTextColor}
            details={opts.input[inp.name]}
            background={
              selectedInput === inp.name || hasRelation(relations, inp.name, selectedOutput) ?
              rectSelectedBackgroundColor :
              rectBackgroundColor
            }
            toggleTooltip={toggleTooltip}
            onInputSelected={handleInputSelected}
            onInputUnselected={handleInputUnselected}
            relations={relations}
            fieldType="input"
          >
            {inp.name}
          </SelectableLabel>
        ))}

        {outputMap.map((out, index) => (
          <SelectableLabel
            key={`output_${out.name}`}
            x={svgWidth + offsetX - (rectWidth * 2.5)}
            y={
              outputOffsetY + (headerHeight + parseInt(
                out.position || out.position === 0 ? out.position : index, 10
              ) * (rectHeight + paddingElements))
            }
            offsetX={10}
            width={rectWidth}
            height={rectHeight}
            textColor={rectTextColor}
            details={opts.output[out.name]}
            background={
              selectedOutput === out.name || hasRelation(relations, selectedInput, out.name) ?
              rectSelectedBackgroundColor :
              rectBackgroundColor
            }
            toggleTooltip={toggleTooltip}
            onInputSelected={handleOutputSelected}
            onInputUnselected={handleOutputUnselected}
            relations={relations}
            fieldType="output"
          >
            {out.name}
          </SelectableLabel>
        ))}

        {outputMap.map((out, index) => (
          <foreignObject
            key={out.name}
            x={svgWidth + offsetX - (rectWidth * 1.5)}
            y={
              outputOffsetY + (headerHeight + parseInt(index, 10) *
              (rectHeight + paddingElements))
            }
            width={rectWidth}
            height={rectHeight}
            style={{ overflow: 'hidden' }}
          >
            <FieldDetail
              name={out.name}
              onShowAll={handleDetailSelection}
              fieldSource={mapper.field_source[out.name]}
            />
          </foreignObject>
        ))}

        {relations.map((item, index) => (
          <Connection
            key={`input_${index}`}
            item={item}
            type="input-arrow"
            {...{
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
            }}
          />
        ))}

        {relations.map((item, index) => (
          <Connection
            key={`output_${index}`}
            item={item}
            type="output-arrow"
            {...{
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
            }}
          />
        ))}

        {relations.map((item, index) => (
          <Connection
            key={`line_${index}`}
            item={item}
            type="line"
            {...{
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
              lineColor,
            }}
          />
        ))}
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

const getNewPosition = (position, output) => {
  let result = position;

  // eslint-disable-next-line
  while (output.find(obj => obj.position === result)) {
    result = result + 1;
  }

  return result;
};

const getInputFieldsMap = (source, relations) => (
  Object
    .keys(source)
    .map((item, idx) => [item, idx])
    .reduce((prev, current) => {
      const hasRel = relations.map((rel: Object) => {
        const entries = Object.entries(rel)[0];

        if (entries[0] === current[0] || entries[1] === current[0]) {
          return entries[0];
        }

        return null;
      }).filter(itm => itm);

      return ([...prev, {
        name: current[0],
        relation: hasRel.length ? hasRel : null,
      }]);
    }, [])
    .sort(a => (a.relation ? -1 : 1))
    .map((item, idx) => ({ ...item, position: idx }))
);

const getOutputFieldsMap = (source, relations, inputs, fieldSources) => (
  Object
  .keys(source)
  .map((item, idx) => [item, idx])
  .reduce((prev, current) => {
    const hasRel = inputs.find(obj => (
      includes(obj.relation, current[0])
    ));

    const { data, code }= formatFieldSource(fieldSources[current[0]]);
    const hasData = data.length > 0 || code !== '';

    return ([...prev, {
      name: current[0],
      position: hasRel ?
        getNewPosition(hasRel.position, prev) : null,
      relation: hasRel || null,
      hasData,
    }]);
  }, [])
  .sort(a => {
    if (a.position || a.position === 0) {
      return -1;
    }

    if (a.hasData) {
      return 0;
    }

    return 1;
  })
);

const getRelationsData = mapProps(props => ({
  ...props,
  relations: getRelations(props.mapper.field_source, props.mapper.opts.input),
  opts: props.mapper.opts,
}));

const getInputMap = mapProps(props => ({
  ...props,
  inputMap: getInputFieldsMap(
    props.mapper.opts.input,
    props.relations,
  ),
}));

const getOutputMap = mapProps(props => ({
  ...props,
  outputMap: getOutputFieldsMap(
    props.mapper.opts.output,
    props.relations,
    props.inputMap,
    props.mapper.field_source,
  ),
}));

const appendMaxElementCount = withProps(({ inputMap, outputMap }) => ({
  inputCount: inputMap.length,
  outputCount: outputMap.length,
  elementCount: Math.max(inputMap.length, outputMap.length),
}));

const appendDiagramParams = compose(
  withProps(({ elementCount }) => ({
    svgWidth: SVG_WIDTH,
    rectHeight: RECT_HEIGHT,
    rectWidth: RECT_WIDTH,
    offsetX: OFFSET_X,
    offsetY: OFFSET_Y,
    paddingElements: PADDING_ELEMENTS,
    headerHeight: HEADER_HEIGHT,
    rectBackgroundColor: '#7da832',
    rectSelectedBackgroundColor: '#5f8316',
    rectTextColor: 'white',
    headerTextColor: 'black',
    lineColor: 'black',
    svgHeight: elementCount * (RECT_HEIGHT + PADDING_ELEMENTS) + HEADER_HEIGHT + OFFSET_Y * 2,
    inputOffsetY: 0,
    outputOffsetY: 0,
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
  getInputMap,
  getOutputMap,
  appendMaxElementCount,
  appendDiagramParams,
  addInputSelection,
  addOutputSelection,
  setDetail,
  toggleTooltip,
)(Diagramm);
