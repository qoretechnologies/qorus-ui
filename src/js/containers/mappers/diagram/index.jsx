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
import Tooltip from './tooltip';
import Connection from './connection';
import modal from '../../../hocomponents/modal';
import DetailModal from './modals/DetailModal';
import Flex from '../../../components/Flex';

const getRelations = (fieldSource: Object, inputs: Object): Array<Object> =>
  Object.entries(fieldSource)
    .map(
      ([key, value]: [string, any]): any => {
        let str = value.replace(/ /g, '');
        str = value.replace(/\n/g, '');
        str = value.replace(/\s+/g, '');

        const regex = /^[.({]"name":+"([-.\w]+)"/;
        const matching = str.match(regex);

        if (matching) {
          const match =
            matching[1].indexOf('.') !== -1
              ? matching[1].split('.')
              : [matching[1]];

          return { [key]: match[0] };
        }

        if (inputs && inputs[key]) {
          const seq = /^\("sequence":+"(\w+)"/;
          const con = /^\("constant":+"(\w+)"/;
          const run = /^\("runtime":+"(\w+)"/;

          if (!str.match(seq) && !str.match(con) && !str.match(run)) {
            return { [key]: key };
          }
        }

        return null;
      }
    )
    .filter(item => item);

function hasRelation (array, input, output) {
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
  <Flex className="mapper-wrapper" scrollY>
    <Tooltip data={tooltip} />
    <div id={id} className="svg-diagram">
      <svg
        height={svgHeight}
        width={svgWidth}
        id="mapper"
        style={{ margin: '0 auto' }}
      >
        <Header
          textColor={headerTextColor}
          offsetX={offsetX}
          offsetY={offsetY}
          rectWidth={rectWidth}
          svgWidth={svgWidth}
          headerHeight={headerHeight}
        />

        {Object.entries(inputMap).map(([name, position]) => (
          <SelectableLabel
            key={`input_${name}`}
            x={0}
            y={
              inputOffsetY +
              (headerHeight +
                parseInt(position, 10) * (rectHeight + paddingElements))
            }
            offsetX={10}
            width={rectWidth}
            height={rectHeight}
            textColor={rectTextColor}
            details={opts.input[name]}
            background={
              selectedInput === name ||
              hasRelation(relations, name, selectedOutput)
                ? rectSelectedBackgroundColor
                : rectBackgroundColor
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

        {Object.entries(outputMap).map(([name, position]) => (
          <SelectableLabel
            key={`output_${name}`}
            x={svgWidth + offsetX - rectWidth * 2.5}
            y={
              outputOffsetY +
              (headerHeight +
                parseInt(position, 10) * (rectHeight + paddingElements))
            }
            offsetX={10}
            width={rectWidth}
            height={rectHeight}
            textColor={rectTextColor}
            details={opts.output[name]}
            background={
              selectedOutput === name ||
              hasRelation(relations, selectedInput, name)
                ? rectSelectedBackgroundColor
                : rectBackgroundColor
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

        {Object.entries(outputMap).map(([name, position]) => (
          <foreignObject
            key={name}
            x={svgWidth + offsetX - rectWidth * 1.5}
            y={
              outputOffsetY +
              (headerHeight +
                parseInt(position, 10) * (rectHeight + paddingElements))
            }
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
  </Flex>
);

const SVG_WIDTH = 720;
const OFFSET_X = 90;
const OFFSET_Y = 20;
const HEADER_HEIGHT = 40;
const PADDING_ELEMENTS = 5;
const RECT_HEIGHT = 45;
const RECT_WIDTH = 200;

const getFieldsMap = source =>
  Object.keys(source)
    .map((item, idx) => [item, idx])
    .reduce((prev, current) => ({ ...prev, [current[0]]: current[1] }), {});

const getRelationsData = mapProps(props => ({
  ...props,
  inputMap: props.mapper.opts.input
    ? getFieldsMap(props.mapper.opts.input)
    : [],
  outputMap: props.mapper.opts.output
    ? getFieldsMap(props.mapper.opts.output)
    : [],
  relations: getRelations(props.mapper.field_source, props.mapper.opts.input),
  opts: props.mapper.opts,
}));

const appendMaxElementCount = withProps(({ inputMap, outputMap }) => ({
  inputCount: Object.keys(inputMap).length,
  outputCount: Object.keys(outputMap).length,
  elementCount: Math.max(
    Object.keys(inputMap).length,
    Object.keys(outputMap).length
  ),
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
    svgHeight:
      elementCount * (RECT_HEIGHT + PADDING_ELEMENTS) +
      HEADER_HEIGHT +
      OFFSET_Y * 2,
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
  withProps(({ openModal, closeModal }) => ({
    handleDetailSelection: detail => {
      openModal(<DetailModal onClose={closeModal} detail={detail} />);
    },
  }))
);

const toggleTooltip = compose(
  withState('tooltip', 'detailToggler', null),
  withProps(({ detailToggler }) => ({
    toggleTooltip: detail => detailToggler(detail),
  }))
);

export default compose(
  modal(),
  getRelationsData,
  appendMaxElementCount,
  appendDiagramParams,
  addInputSelection,
  addOutputSelection,
  setDetail,
  toggleTooltip,
  pure
)(Diagramm);
