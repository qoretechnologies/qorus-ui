import { Tooltip } from '@blueprintjs/core';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import styled, { css } from 'styled-components';
import { getStaticDataFieldname, hasStaticDataField } from '../../../helpers/mapper';
import MapperInput from './input';
import MapperOutput from './output';

const FIELD_HEIGHT = 35;
const FIELD_MARGIN = 14;
const TYPE_COLORS = {
  int: '#3a9c52',
  float: '#1f8c71',
  number: '#217536',

  string: '#2c5ba8',
  date: '#443e9c',

  listauto: '#693594',
  hashauto: '#9723a8',

  bool: '#a66121',
  binary: '#e6b12e',

  any: '#a9a9a9',
};

export const StyledMapperWrapper = styled.div`
  width: 900px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin: 0 auto;
  height: 100%;
`;

export const StyledFieldsWrapper = styled.div`
  flex: 1 1 auto;
  height: 100%;
  width: 300px;
`;

export const StyledConnectionsWrapper = styled.div`
  flex: 1 1 auto;
  height: 100%;
  width: 300px;
`;

export const StyledMapperField = styled.div`
  width: ${({ isChild, level }) => (isChild ? `${300 - level * 15}px` : '300px')};

  ${({ input, isChild, level }) =>
    input &&
    css`
      margin-left: ${isChild ? `${level * 15}px` : '0'};
    `}

  height: ${({ isInputHash }) => (isInputHash ? '55px' : `${FIELD_HEIGHT}px`)};
  border: 1px solid #d7d7d7;
  border-radius: 3px;
  margin-bottom: ${FIELD_MARGIN}px;
  transition: all 0.3s;
  background-color: #fff;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.04);
  position: relative;
  cursor: ${({ isDisabled }) => (isDisabled ? 'initial' : 'pointer')};

  .field-manage {
    display: none;
  }

  ${({ isDisabled }) =>
    css`
      &:hover {
        border-color: ${isDisabled ? '#d7d7d7' : '#137cbd'};

        .field-manage {
          display: unset;
        }
      }
    `};

  ${({ childrenCount, isDragging }) =>
    childrenCount !== 0 && !isDragging
      ? css`
          &:after {
            content: '';
            display: table;
            position: absolute;
            width: 1px;
            ${({ input }) =>
              input
                ? css`
                    left: -1px;
                  `
                : css`
                    right: -1px;
                  `};
            top: ${FIELD_HEIGHT / 2}px;
            height: ${childrenCount * (FIELD_HEIGHT + FIELD_MARGIN)}px;
            background-color: #d7d7d7;
            z-index: 0;
          }
        `
      : null}

  ${({ isChild, isDragging }) =>
    isChild && !isDragging
      ? css`
          &:before {
            content: '';
            display: table;
            position: absolute;
            width: 15px;
            height: 1px;
            ${({ input }) =>
              input
                ? css`
                    left: -15px;
                  `
                : css`
                    right: -15px;
                  `};
            top: ${FIELD_HEIGHT / 2}px;
            background-color: #d7d7d7;
            z-index: 0;
          }
        `
      : null}

    h4 {
    text-align: center;
    font-size: 14px;
    line-height: 34px;
    margin: 0;
    padding: 0;
  }

  p.type {
    background-color: #d7d7d7;

    &.string {
      background-color: ${TYPE_COLORS.string};
    }
    &.int {
      background-color: ${TYPE_COLORS.int};
    }
    &.number {
      background-color: ${TYPE_COLORS.number};
    }
    &.float {
      background-color: ${TYPE_COLORS.float};
    }
    &.date {
      background-color: ${TYPE_COLORS.date};
    }
    &.listauto {
      background-color: ${TYPE_COLORS.listauto};
    }
    &.hashauto {
      background-color: ${TYPE_COLORS.hashauto};
    }
    &.binary {
      background-color: ${TYPE_COLORS.binary};
    }
    &.bool {
      background-color: ${TYPE_COLORS.bool};
    }
    &.any {
      background-color: ${TYPE_COLORS.any};
    }
    border-radius: 3px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 10px;
    line-height: 14px;
    top: -8px;
    margin: 0;
    padding: 0 3px;
    color: #fff;
  }
`;

const StyledInfoMessage = styled.p`
  text-align: center;
  color: #a9a9a9;
`;

const StyledUrlMessage = styled.p`
  text-align: center;
  height: 30px;
  line-height: 30px;
  text-overflow: ellipsis;
  color: #a9a9a9;
  font-size: 12px;
  font-weight: 300;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
`;

const StyledFieldHeader = styled.h3`
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  text-align: center;
  font-size: 19px;
`;

const StyledLine = styled.line`
  stroke-width: 3px;
  cursor: pointer;
`;

export interface IMapperCreatorProps {
  inputs: any[];
  outputs: any[];
  relations: any;
  inputUrl: any;
}

export interface IMapperRelation {
  input: string;
  output: string;
}

const MapperCreator: React.FC<IMapperCreatorProps> = ({
  inputs,
  outputs,
  relations,
  inputUrl,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'outputUrl' does not exist on type 'Props... Remove this comment to see the full error message
  outputUrl,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onInfoClick' does not exist on type 'Pro... Remove this comment to see the full error message
  onInfoClick,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'staticData' does not exist on type 'Prop... Remove this comment to see the full error message
  staticData,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'PropsWithC... Remove this comment to see the full error message
  intl,
}) => {
  // This functions flattens the fields, by taking all the
  // deep fields from `type` and adds them right after their
  // respective parent field
  const flattenFields: (
    fields: any,
    isChild?: boolean,
    parent?: string,
    level?: number,
    path?: string
  ) => any[] = (fields, isChild = false, parent, level = 0, path = '') =>
    reduce(
      fields,
      (newFields, field, name) => {
        let res = [...newFields];
        // Build the path for the child fields
        const newPath = level === 0 ? name : `${path}.${name}`;
        const parentPath = level !== 0 && `${path}`;
        // Add the current field
        res = [
          ...res,
          {
            name,
            ...{ ...field, isChild, level, parent, path: newPath, parentPath },
          },
        ];
        // Check if this field has hierarchy
        if (size(field.type.fields)) {
          // Recursively add deep fields
          res = [...res, ...flattenFields(field.type.fields, true, name, level + 1, newPath)];
        }
        // Return the new fields
        return res;
      },
      []
    );

  const flattenedInputs = inputs && flattenFields(inputs);
  const flattenedContextInputs = staticData && flattenFields(staticData);
  const flattenedOutputs = outputs && flattenFields(outputs);

  const getFieldTypeColor: (
    type: 'inputs' | 'outputs' | 'context',
    name: string,
    types?: string[]
  ) => string = (type, name, types) => {
    if (types) {
      // Return the color
      return TYPE_COLORS[types[0].replace(/</g, '').replace(/>/g, '')];
    }
    const fieldTypes = {
      inputs: flattenedInputs,
      outputs: flattenedOutputs,
      context: flattenedContextInputs,
    };
    // Find the field
    const field = fieldTypes[type].find((input) => input.path === name);
    if (field) {
      // Return the color
      return TYPE_COLORS[field.type.types_returned[0].replace(/</g, '').replace(/>/g, '')];
    }
    return null;
  };

  const getLastChildIndex = (field: any, fields: any[]) => {
    // Only get the child index for fields
    // that actually have children
    if (size(field.type.fields)) {
      // Get the name of the last field
      const name: string = Object.keys(field.type.fields).find(
        (_name, index) => index === size(field.type.fields) - 1
      );
      // Get the index of the last field in this
      // hierarchy based on the name
      return findIndex(fields, (curField) => curField.path === `${field.path}.${name}`);
    }
    // Return nothing
    return 0;
  };

  const filterEmptyRelations: (relations: any) => any = (relations) => {
    return reduce(
      relations,
      (newRel, rel, name) => {
        if (size(rel)) {
          return {
            ...newRel,
            [name]: rel,
          };
        }
        return newRel;
      },
      {}
    );
  };

  const getCustomFields: (type: string) => any[] = (type) => {
    if (type === 'inputs') {
      return flattenedInputs.reduce((newInputs, input) => {
        if (input.firstCustomInHierarchy) {
          return { ...newInputs, [input.name]: input };
        }
        return newInputs;
      }, {});
    } else {
      return flattenedOutputs.reduce((newOutputs, output) => {
        if (output.firstCustomInHierarchy) {
          return { ...newOutputs, [output.name]: output };
        }
        return newOutputs;
      }, {});
    }
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          marginTop: '15px',
          padding: 10,
          flex: 1,
          overflow: 'auto',
        }}
      >
        <StyledMapperWrapper>
          <StyledFieldsWrapper>
            <StyledFieldHeader>
              <MapperInput
                // @ts-ignore ts-migrate(2322) FIXME: Type 'Element' is not assignable to type 'string'.
                name={
                  <>
                    <span> Input </span>

                    <Tooltip targetTagName="div" content={inputUrl}>
                      <StyledUrlMessage style={{ height: '12px', lineHeight: '12px' }}>
                        {inputUrl}
                      </StyledUrlMessage>
                    </Tooltip>
                  </>
                }
                types={['hash<auto>']}
                type={{
                  base_type: 'hash<auto>',
                }}
                id={1}
                isWholeInput
                lastChildIndex={0}
              />
            </StyledFieldHeader>
            {size(flattenedInputs) !== 0
              ? map(flattenedInputs, (input, index) => (
                  <MapperInput
                    key={input.path}
                    name={input.name}
                    types={input.type.types_returned}
                    {...input}
                    field={input}
                    id={index + 1}
                    lastChildIndex={getLastChildIndex(input, flattenedInputs) - index}
                  />
                ))
              : null}
            {size(flattenedInputs) === 0 ? (
              <StyledInfoMessage>{'This mapper has no input fields'}</StyledInfoMessage>
            ) : null}
            {size(flattenedContextInputs) !== 0 && (
              <MapperInput
                // @ts-ignore ts-migrate(2322) FIXME: Type 'Element' is not assignable to type 'string'.
                name={
                  <>
                    <span>{intl.formatMessage({ id: 'mapper.staticData' })}</span>

                    <StyledUrlMessage style={{ height: '12px', lineHeight: '12px' }}>
                      {intl.formatMessage({ id: 'mapper.staticDataDesc' })}
                    </StyledUrlMessage>
                  </>
                }
                types={['hash<auto>']}
                type={{
                  base_type: 'hash<auto>',
                }}
                id={1}
                isWholeInput
                usesContext
                lastChildIndex={0}
              />
            )}
            {size(flattenedContextInputs) !== 0
              ? map(flattenedContextInputs, (input, index) => (
                  <MapperInput
                    key={input.path}
                    name={input.name}
                    types={input.type.types_returned}
                    {...input}
                    field={input}
                    id={(flattenedInputs?.length || 0) + (index + 1)}
                    lastChildIndex={getLastChildIndex(input, flattenedContextInputs) - index}
                    usesContext
                  />
                ))
              : null}
          </StyledFieldsWrapper>
          <StyledConnectionsWrapper>
            {size(relations) ? (
              <svg
                height={
                  Math.max(
                    [...(flattenedInputs || []), ...(flattenedContextInputs || [])]?.length,
                    flattenedOutputs?.length
                  ) *
                    (FIELD_HEIGHT + FIELD_MARGIN) +
                  126
                }
              >
                {map(relations, (relation, outputPath) => (
                  <>
                    {!!relation.name && (
                      <>
                        <defs>
                          <linearGradient
                            id={outputPath}
                            x1="0"
                            y1={
                              (flattenedInputs.findIndex((input) => input.path === relation.name) +
                                1) *
                                (FIELD_HEIGHT + FIELD_MARGIN) -
                              (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                              61 -
                              0.5
                            }
                            x2={0}
                            y2={
                              (flattenedOutputs.findIndex((output) => output.path === outputPath) +
                                1) *
                                (FIELD_HEIGHT + FIELD_MARGIN) -
                              (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                              61 +
                              0.5
                            }
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stop-color={getFieldTypeColor('inputs', relation.name)}
                              offset="0"
                            />
                            <stop
                              stop-color={getFieldTypeColor('outputs', outputPath)}
                              offset="1"
                            />
                          </linearGradient>
                        </defs>
                        <StyledLine
                          key={outputPath}
                          stroke={`url(#${outputPath})`}
                          x1={0}
                          y1={
                            (flattenedInputs.findIndex((input) => input.path === relation.name) +
                              1) *
                              (FIELD_HEIGHT + FIELD_MARGIN) -
                            (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                            61 -
                            1.5
                          }
                          x2={300}
                          y2={
                            (flattenedOutputs.findIndex((output) => output.path === outputPath) +
                              1) *
                              (FIELD_HEIGHT + FIELD_MARGIN) -
                            (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                            61 +
                            1.5
                          }
                        />
                      </>
                    )}
                    {relation.use_input_record && (
                      <>
                        <defs>
                          <linearGradient
                            id={outputPath}
                            x1="0"
                            y1={27}
                            x2={0}
                            y2={
                              (flattenedOutputs.findIndex((output) => output.path === outputPath) +
                                1) *
                                (FIELD_HEIGHT + FIELD_MARGIN) -
                              (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                              61 +
                              0.5
                            }
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stop-color={getFieldTypeColor('inputs', null, ['hash<auto>'])}
                              offset="0"
                            />
                            <stop
                              stop-color={getFieldTypeColor('outputs', outputPath)}
                              offset="1"
                            />
                          </linearGradient>
                        </defs>
                        <StyledLine
                          key={outputPath}
                          stroke={`url(#${outputPath})`}
                          x1={0}
                          y1={27}
                          x2={300}
                          y2={
                            (flattenedOutputs.findIndex((output) => output.path === outputPath) +
                              1) *
                              (FIELD_HEIGHT + FIELD_MARGIN) -
                            (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                            61 +
                            1.5
                          }
                        />
                      </>
                    )}
                    {!!relation.context &&
                    hasStaticDataField(relation.context) &&
                    size(flattenedContextInputs) ? (
                      <>
                        <defs>
                          <linearGradient
                            id={outputPath}
                            x1="0"
                            y1={
                              63 +
                              63 +
                              ((size(flattenedInputs) || 1) +
                                flattenedContextInputs.findIndex(
                                  (input) => input.path === getStaticDataFieldname(relation.context)
                                ) +
                                1) *
                                (FIELD_HEIGHT + FIELD_MARGIN) -
                              (FIELD_HEIGHT / 2 + FIELD_MARGIN)
                            }
                            x2={0}
                            y2={
                              (flattenedOutputs.findIndex((output) => output.path === outputPath) +
                                1) *
                                (FIELD_HEIGHT + FIELD_MARGIN) -
                              (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                              61 +
                              0.5
                            }
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stop-color={getFieldTypeColor(
                                'context',
                                getStaticDataFieldname(relation.context)
                              )}
                              offset="0"
                            />
                            <stop
                              stop-color={getFieldTypeColor('outputs', outputPath)}
                              offset="1"
                            />
                          </linearGradient>
                        </defs>
                        <StyledLine
                          key={outputPath}
                          stroke={`url(#${outputPath})`}
                          x1={0}
                          y1={
                            63 +
                            63 +
                            ((size(flattenedInputs) || 1) +
                              flattenedContextInputs.findIndex(
                                (input) => input.path === getStaticDataFieldname(relation.context)
                              ) +
                              1) *
                              (FIELD_HEIGHT + FIELD_MARGIN) -
                            (FIELD_HEIGHT / 2 + FIELD_MARGIN)
                          }
                          x2={300}
                          y2={
                            (flattenedOutputs.findIndex((output) => output.path === outputPath) +
                              1) *
                              (FIELD_HEIGHT + FIELD_MARGIN) -
                            (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                            61 +
                            1.5
                          }
                        />
                      </>
                    ) : null}
                    {!!relation.context &&
                    relation.context === '$static:*' &&
                    size(flattenedContextInputs) ? (
                      <>
                        <defs>
                          <linearGradient
                            id={outputPath}
                            x1="0"
                            y1={
                              63 +
                              63 +
                              (size(flattenedInputs) || 1) * (FIELD_HEIGHT + FIELD_MARGIN) -
                              31.5
                            }
                            x2={0}
                            y2={
                              (flattenedOutputs.findIndex((output) => output.path === outputPath) +
                                1) *
                                (FIELD_HEIGHT + FIELD_MARGIN) -
                              (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                              61 +
                              0.5
                            }
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop
                              stop-color={getFieldTypeColor('context', null, ['hash<auto>'])}
                              offset="0"
                            />
                            <stop
                              stop-color={getFieldTypeColor('outputs', outputPath)}
                              offset="1"
                            />
                          </linearGradient>
                        </defs>
                        <StyledLine
                          key={outputPath}
                          stroke={`url(#${outputPath})`}
                          x1={0}
                          y1={
                            63 +
                            63 +
                            (size(flattenedInputs) || 1) * (FIELD_HEIGHT + FIELD_MARGIN) -
                            31.5
                          }
                          x2={300}
                          y2={
                            (flattenedOutputs.findIndex((output) => output.path === outputPath) +
                              1) *
                              (FIELD_HEIGHT + FIELD_MARGIN) -
                            (FIELD_HEIGHT / 2 + FIELD_MARGIN) +
                            61 +
                            1.5
                          }
                        />
                      </>
                    ) : null}
                  </>
                ))}
              </svg>
            ) : null}
          </StyledConnectionsWrapper>
          <StyledFieldsWrapper>
            <StyledFieldHeader>
              {'Output'}{' '}
              <Tooltip targetTagName="div" content={outputUrl}>
                <StyledUrlMessage>{outputUrl}</StyledUrlMessage>
              </Tooltip>
            </StyledFieldHeader>
            {size(flattenedOutputs) !== 0
              ? map(flattenedOutputs, (output, index) => (
                  <MapperOutput
                    key={output.path}
                    name={output.name}
                    hasRelation={!!relations[output.path]}
                    {...output}
                    field={output}
                    id={index + 1}
                    onManageClick={() => {
                      !!relations[output.path] && onInfoClick(output.path);
                    }}
                    accepts={output.type.types_accepted}
                    lastChildIndex={getLastChildIndex(output, flattenedOutputs) - index}
                  />
                ))
              : null}
            {size(flattenedOutputs) === 0 ? (
              <StyledInfoMessage>{'This mapper has no output fields'}</StyledInfoMessage>
            ) : null}
          </StyledFieldsWrapper>
        </StyledMapperWrapper>
      </div>
    </>
  );
};

export default compose(injectIntl)(MapperCreator);
