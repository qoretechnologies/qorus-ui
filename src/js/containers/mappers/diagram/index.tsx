/* @flow */
import map from 'lodash/map';
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';
import Flex from '../../../components/Flex';
import modal from '../../../hocomponents/modal';
import Connection from './connection';
import Header from './header';
import DetailModal from './modals/DetailModal';
import SelectableLabel from './selectable-label';
import Tooltip from './tooltip';

const getRelations = (fields: any, inputs: any): Array<Object> =>
  map(fields, (outputData, outputName): any => {
    if (typeof outputData === 'string') {
      return { [outputName]: outputData };
    } else if (outputData.name) {
      let name = outputData.name;

      if (outputData.name.indexOf('.') !== -1) {
        name = outputData.name.split('.')[0];
      }

      return { [outputName]: name };
    }

    return null;
  }).filter((item) => item);

function hasRelation(array, input, output) {
  return !!array.find((item) => {
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
  fields,
}: {
  id: string;
  svgWidth: number;
  svgHeight: number;
  offsetX: number;
  offsetY: number;
  inputOffsetY: number;
  outputOffsetY: number;
  rectWidth: number;
  rectHeight: number;
  headerHeight: number;
  paddingElements: number;
  headerTextColor: string;
  rectBackgroundColor: string;
  rectSelectedBackgroundColor: string;
  rectTextColor: string;
  lineColor: string;
  selectedInput: string;
  selectedOutput: string;
  inputMap: any;
  outputMap: any;
  relations: any;
  handleInputSelected: Function;
  handleInputUnselected: Function;
  handleOutputSelected: Function;
  handleOutputUnselected: Function;
  mapper: any;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  selectedDetail: any;
  handleDetailSelection: Function;
  opts: any;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  tooltip: any;
  toggleTooltip: Function;
  fields: any;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}) => (
  <Flex className="mapper-wrapper" scrollY>
    <Tooltip data={tooltip} />
    <div id={id} className="svg-diagram">
      <svg height={svgHeight} width={svgWidth} id="mapper" style={{ margin: '0 auto' }}>
        <Header
          textColor={headerTextColor}
          offsetX={offsetX}
          offsetY={offsetY}
          rectWidth={rectWidth}
          svgWidth={svgWidth}
          headerHeight={headerHeight}
        />

        {Object.entries(inputMap).map(([name, position]: any) => (
          <SelectableLabel
            key={`input_${name}`}
            x={1}
            y={
              inputOffsetY +
              (headerHeight + parseInt(position, 10) * (rectHeight + paddingElements))
            }
            offsetX={10}
            width={rectWidth}
            height={rectHeight}
            textColor={rectTextColor}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'input' does not exist on type 'Object'.
            details={opts.input[name]}
            isSelected={selectedInput === name || hasRelation(relations, name, selectedOutput)}
            toggleTooltip={toggleTooltip}
            onInputSelected={handleInputSelected}
            onInputUnselected={handleInputUnselected}
            relations={relations}
            onCodeClick={handleDetailSelection}
            onInfoClick={handleDetailSelection}
            fieldType="input"
          >
            {name}
          </SelectableLabel>
        ))}

        {Object.entries(outputMap).map(([name, position]: any) => (
          <SelectableLabel
            key={`output_${name}`}
            x={rectWidth + rectWidth / 2 + 1}
            y={
              outputOffsetY +
              (headerHeight + parseInt(position, 10) * (rectHeight + paddingElements))
            }
            offsetX={10}
            width={rectWidth}
            height={rectHeight}
            textColor={rectTextColor}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'output' does not exist on type 'Object'.
            details={{ ...opts.output[name], ...fields[name] }}
            isSelected={selectedOutput === name || hasRelation(relations, selectedInput, name)}
            toggleTooltip={toggleTooltip}
            onInputSelected={handleOutputSelected}
            onInputUnselected={handleOutputUnselected}
            onCodeClick={handleDetailSelection}
            onInfoClick={handleDetailSelection}
            relations={relations}
            fieldType="output"
          >
            {name}
          </SelectableLabel>
        ))}

        {relations &&
          // @ts-ignore ts-migrate(2339) FIXME: Property 'map' does not exist on type 'Object'.
          relations.map((item, index) => (
            <Connection
              key={`input_${index}`}
              item={item}
              isSelected={Object.entries(item)[0].includes(selectedInput || selectedOutput)}
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

        {relations &&
          // @ts-ignore ts-migrate(2339) FIXME: Property 'map' does not exist on type 'Object'.
          relations.map((item, index) => (
            <Connection
              key={`output_${index}`}
              item={item}
              type="output-arrow"
              isSelected={Object.entries(item)[0].includes(selectedInput || selectedOutput)}
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

        {relations &&
          // @ts-ignore ts-migrate(2339) FIXME: Property 'map' does not exist on type 'Object'.
          relations.map((item, index) => (
            <Connection
              key={`line_${index}`}
              item={item}
              type="line"
              isSelected={Object.entries(item)[0].includes(selectedInput || selectedOutput)}
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

const SVG_WIDTH = 626;
const OFFSET_X = 90;
const OFFSET_Y = 20;
const HEADER_HEIGHT = 40;
const PADDING_ELEMENTS = 5;
const RECT_HEIGHT = 65;
const RECT_WIDTH = 250;

const getFieldsMap = (source) =>
  Object.keys(source)
    .map((item, idx) => [item, idx])
    .reduce((prev, current) => ({ ...prev, [current[0]]: current[1] }), {});

const getRelationsData = mapProps((props) => ({
  ...props,
  inputMap: props.mapper.options.input ? getFieldsMap(props.mapper.options.input) : [],
  outputMap: props.mapper.options.output ? getFieldsMap(props.mapper.options.output) : [],
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  relations: getRelations(props.mapper.fields),
  opts: props.mapper.options,
  fields: props.mapper.fields,
}));

const appendMaxElementCount = withProps(({ inputMap, outputMap }) => ({
  inputCount: Object.keys(inputMap).length,
  outputCount: Object.keys(outputMap).length,
  elementCount: Math.max(Object.keys(inputMap).length, Object.keys(outputMap).length),
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
    handleInputSelected: (input) => setSelectedInput(input),
    handleInputUnselected: () => setSelectedInput(null),
  }))
);

const addOutputSelection = compose(
  withState('selectedOutput', 'setSelectedOutput', null),
  withProps(({ setSelectedOutput }) => ({
    handleOutputSelected: (input) => setSelectedOutput(input),
    handleOutputUnselected: () => setSelectedOutput(null),
  }))
);

const setDetail = compose(
  withProps(({ openModal, closeModal }) => ({
    handleDetailSelection: (detail, tab) => {
      openModal(<DetailModal onClose={closeModal} detail={detail} tab={tab} />);
    },
  }))
);

const toggleTooltip = compose(
  withState('tooltip', 'detailToggler', null),
  withProps(({ detailToggler }) => ({
    toggleTooltip: (detail) => detailToggler(detail),
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
  toggleTooltip
)(Diagramm);
