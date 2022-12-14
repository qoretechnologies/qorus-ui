import {
  ReqoreButton,
  ReqoreControlGroup,
  ReqoreMessage,
  ReqorePanel,
  ReqoreTag,
} from '@qoretechnologies/reqore';
import { cloneDeep, findKey, forEach, last } from 'lodash';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import React, { useState } from 'react';
import useMount from 'react-use/lib/useMount';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import styled from 'styled-components';
import { isObject } from 'util';
import { insertAtIndex } from '../../helpers/functions';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import Spacer from '../Spacer';
import AutoField from './auto';
import SelectField from './select';
import SubField from './subfield';
import { TemplateField } from './template';
import { validateField } from './validations';

export const StyledOptionField = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-left: 1px solid #e6e6e6;

  &:nth-child(even) {
    background-color: #ffffff;
  }

  &:nth-child(odd) {
    background-color: #f7f7f7;
  }

  &:first-child {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-top: 1px solid #e6e6e6;
  }

  &:last-child {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;

const getType = (
  type: IQorusType | IQorusType[],
  operators?: IOperatorsSchema,
  operator?: TOperatorValue
): IQorusType => {
  const finalType = getTypeFromOperator(operators, fixOperatorValue(operator)) || type;

  return isArray(finalType) ? finalType[0] : (finalType as IQorusType);
};

const getTypeFromOperator = (
  operators?: IOperatorsSchema,
  operatorData?: (string | null | undefined)[]
) => {
  if (!operators || !operatorData || !size(operatorData) || !last(operatorData)) {
    return null;
  }

  return operators[last(operatorData) as string]?.type || null;
};

export const fixOperatorValue = (operator: TOperatorValue): (string | null | undefined)[] => {
  // @ts-ignore
  return isArray(operator) ? operator : [operator];
};

/* "Fix options to be an object with the correct type." */
export const fixOptions = (
  value: IOptions = {},
  options: IOptionsSchema,
  operators?: IOperatorsSchema
): IOptions => {
  const fixedValue = cloneDeep(value);

  // Add missing required options to the fixedValue
  forEach(options, (option, name) => {
    if (option.required && !fixedValue[name]) {
      fixedValue[name] = {
        type: getType(option.type, operators, fixedValue[name]?.op),
        value: option.default_value,
      };
    }
  });

  return reduce(
    fixedValue,
    (newValue, option, optionName) => {
      if (!isObject(option)) {
        return {
          ...newValue,
          [optionName]: {
            type: getType(options[optionName].type, operators, option.op),
            value: option,
          },
        };
      }

      return { ...newValue, [optionName]: option };
    },
    {}
  );
};

export type IQorusType =
  | 'string'
  | 'int'
  | 'list'
  | 'bool'
  | 'float'
  | 'binary'
  | 'hash'
  | 'date'
  | 'any'
  | 'auto'
  | 'mapper'
  | 'workflow'
  | 'service'
  | 'job'
  | 'data-provider'
  | 'file-as-string'
  | 'select-string'
  | 'number'
  | string;

export type TOperatorValue = string | string[] | undefined | null;

export type TOption = {
  type: IQorusType;
  value: any;
  op?: string[];
};
export type IOptions =
  | {
      [optionName: string]: TOption;
    }
  | undefined;

export interface IOptionsSchema {
  [optionName: string]: {
    type: IQorusType | IQorusType[];
    default_value?: any;
    required?: boolean;
    allowed_values?: any[];
    sensitive?: boolean;
    desc?: string;
  };
}

export interface IOperator {
  type?: IQorusType;
  name: string;
  desc: string;
  supports_nesting?: boolean;
  selected?: boolean;
}

export interface IOperatorsSchema {
  [operatorName: string]: IOperator;
}

export interface IOptionsProps {
  name: string;
  url?: string;
  customUrl?: string;
  value?: IOptions;
  options?: IOptionsSchema;
  onChange: (name: string, value?: IOptions) => void;
  placeholder?: string;
  operatorsUrl?: string;
  noValueString?: string;
  readOnly?: boolean;
}

const Options = ({
  name,
  value,
  onChange,
  url,
  customUrl,
  placeholder,
  operatorsUrl,
  noValueString,
  readOnly,
  ...rest
}: IOptionsProps) => {
  const [options, setOptions] = useState<IOptionsSchema | undefined>(rest?.options || undefined);
  const [operators, setOperators] = useState<IOperatorsSchema | undefined>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getUrl = () => customUrl || `/options/${url}`;

  useMount(() => {
    if (url || customUrl) {
      (async () => {
        setOptions(undefined);
        setLoading(true);
        // Fetch the options for this mapper type
        const data = await get(`${settings.REST_BASE_URL}/${getUrl()}`);

        if (data.err) {
          setLoading(false);
          setOptions(undefined);
          return;
        }
        onChange(name, fixOptions(value || {}, data));
        // Save the new options
        setLoading(false);
        setOptions(data);
      })();
    }
    if (operatorsUrl) {
      (async () => {
        setOperators(undefined);
        setLoading(true);
        // Fetch the options for this mapper type
        const data = await get(`${settings.REST_BASE_URL}/${operatorsUrl}`);

        if (data.err) {
          setLoading(false);
          setOperators({});
          return;
        }
        // Save the new options
        setLoading(false);
        setOperators(data);
      })();
    }
  });

  useUpdateEffect(() => {
    if (url || customUrl) {
      (async () => {
        setOptions(undefined);
        setError(null);
        removeValue();
        setLoading(true);
        // Fetch the options for this mapper type
        const data = await get(`${settings.REST_BASE_URL}/${getUrl()}`);
        if (data.err) {
          setLoading(false);
          setOptions(undefined);
          return;
        }
        // Save the new options
        setLoading(false);
        setOptions(data);
        onChange(name, fixOptions({}, data));
      })();
    }
  }, [url, customUrl]);

  useUpdateEffect(() => {
    if (operatorsUrl) {
      (async () => {
        setOperators(undefined);
        setLoading(true);
        // Fetch the options for this mapper type
        const data = await get(`${settings.REST_BASE_URL}/${operatorsUrl}`);

        if (data.err) {
          setLoading(false);
          setOperators({});
          return;
        }
        // Save the new options
        setLoading(false);
        setOperators(data);
      })();
    }
  }, [operatorsUrl]);

  const handleValueChange = (
    optionName: string,
    currentValue: any = {},
    val?: any,
    type?: string
  ) => {
    // Check if this option is already added
    if (!currentValue[optionName]) {
      // If it's not, add potential default operators
      const defaultOperators: TOperatorValue = reduce(
        operators,
        (filteredOperators: TOperatorValue, operator, operatorKey) => {
          if (operator.selected) {
            return [...(filteredOperators as string[]), operatorKey];
          }

          return filteredOperators;
        },
        []
      );
      // If there are default operators, add them to the value
      if (defaultOperators?.length) {
        onChange(name, {
          ...currentValue,
          [optionName]: {
            type,
            value: val || currentValue[optionName]?.value,
            op: defaultOperators,
          },
        });

        return;
      }
    }
    onChange(name, {
      ...currentValue,
      [optionName]: {
        ...currentValue[optionName],
        type,
        value: val,
      },
    });
  };

  const handleOperatorChange = (
    optionName: string,
    currentValue: IOptions,
    operator: string,
    index: number
  ) => {
    onChange(name, {
      ...currentValue,
      [optionName]: {
        ...currentValue[optionName],
        op: fixOperatorValue(currentValue[optionName].op).map((op, idx) => {
          if (idx === index) {
            return operator;
          }
          return op as string;
        }),
      },
    });
  };

  // Add empty operator at the provider index
  const handleAddOperator = (optionName, currentValue: IOptions, index: number) => {
    onChange(name, {
      ...currentValue,
      [optionName]: {
        ...currentValue[optionName],
        op: insertAtIndex(fixOperatorValue(currentValue[optionName].op), index, null),
      },
    });
  };

  const handleRemoveOperator = (optionName, currentValue: IOptions, index: number) => {
    onChange(name, {
      ...currentValue,
      [optionName]: {
        ...currentValue[optionName],
        op: fixOperatorValue(currentValue[optionName].op).filter((_op, idx) => idx !== index),
      },
    });
  };

  const removeValue = () => {
    onChange(name, undefined);
  };

  const removeSelectedOption = (optionName: string) => {
    delete value?.[optionName];

    onChange(name, value);
  };

  if (error) {
    return (
      <ReqoreMessage intent="danger">
        <p style={{ fontWeight: 500 }}>{'Error Loading Options'}</p>
        {error}
      </ReqoreMessage>
    );
  }

  if (loading) {
    return <p>{'Loading Options'}</p>;
  }

  if (!options || !size(options)) {
    return (
      <ReqoreMessage intent="warning" flat inverted>
        {'No options available for this factory'}
      </ReqoreMessage>
    );
  }

  const addSelectedOption = (optionName: string) => {
    handleValueChange(
      optionName,
      value,
      options[optionName].default_value,
      getTypeAndCanBeNull(options[optionName].type, options[optionName].allowed_values).type
    );
  };

  const getTypeAndCanBeNull = (
    type: IQorusType | IQorusType[],
    allowed_values?: any[],
    operatorData?: TOperatorValue
  ) => {
    let canBeNull = false;
    let realType = getType(type, operators, operatorData);

    if (realType?.startsWith('*')) {
      realType = realType.replace('*', '') as IQorusType;
      canBeNull = true;
    }

    realType = realType === 'string' && allowed_values ? 'select-string' : realType;

    return {
      type: realType,
      defaultType: realType,
      defaultInternalType: realType === 'auto' || realType === 'any' ? undefined : realType,
      canBeNull,
    };
  };

  const fixedValue = fixOptions(value, options);
  const filteredOptions = reduce(
    options,
    (newOptions, option, name) => {
      if (fixedValue && fixedValue[name]) {
        return newOptions;
      }

      return { ...newOptions, [name]: option };
    },
    {}
  );

  return (
    <>
      <div>
        {map(fixedValue, ({ type, ...other }, optionName) =>
          !!options[optionName] ? (
            <StyledOptionField>
              <SubField
                subtle
                key={optionName}
                title={optionName}
                isValid={
                  validateField(getType(type), other.value, { has_to_have_value: true }) &&
                  (operatorsUrl ? !!other.op : true)
                }
                detail={getType(options[optionName].type)}
                desc={options[optionName].desc}
                onRemove={
                  !options[optionName].required && !readOnly
                    ? () => {
                        removeSelectedOption(optionName);
                      }
                    : undefined
                }
              >
                <div>
                  {operators && size(operators) ? (
                    <>
                      <ReqorePanel padded flat rounded customTheme={{ main: '#f7f7f7' }}>
                        <ReqoreControlGroup fluid>
                          <ReqoreTag label="Operators: " />
                          {fixOperatorValue(other.op).map((operator, index) => (
                            <React.Fragment key={index}>
                              <SelectField
                                defaultItems={map(operators, (operator) => ({
                                  name: operator.name,
                                  desc: operator.desc,
                                }))}
                                disabled={readOnly}
                                value={operator && `${operators?.[operator].name}`}
                                onChange={(_n, val) => {
                                  if (val !== undefined) {
                                    handleOperatorChange(
                                      optionName,
                                      fixedValue,
                                      findKey(
                                        operators,
                                        (operator) => operator.name === val
                                      ) as string,
                                      index
                                    );
                                  }
                                }}
                              />
                              {size(fixOperatorValue(other.op)) > 1 ? (
                                <ReqoreButton
                                  icon="DeleteBackLine"
                                  intent="danger"
                                  fixed
                                  onClick={() =>
                                    handleRemoveOperator(optionName, fixedValue, index)
                                  }
                                  disabled={readOnly}
                                />
                              ) : null}
                              {operator && operators[operator].supports_nesting ? (
                                <ReqoreButton
                                  icon="AddLine"
                                  intent="info"
                                  fixed
                                  onClick={() =>
                                    handleAddOperator(optionName, fixedValue, index + 1)
                                  }
                                  disabled={readOnly}
                                />
                              ) : null}
                            </React.Fragment>
                          ))}
                        </ReqoreControlGroup>
                      </ReqorePanel>
                      <Spacer size={10} />
                    </>
                  ) : null}
                  <ReqorePanel padded flat rounded customTheme={{ main: '#f7f7f7' }}>
                    <TemplateField
                      component={AutoField}
                      {...getTypeAndCanBeNull(type, options[optionName].allowed_values)}
                      name={optionName}
                      onChange={(optionName, val) => {
                        if (val !== undefined) {
                          handleValueChange(
                            optionName,
                            fixedValue,
                            val,
                            getTypeAndCanBeNull(type, options[optionName].allowed_values).type
                          );
                        }
                      }}
                      noSoft={!!rest?.options}
                      value={other.value}
                      sensitive={options[optionName].sensitive}
                      default_value={options[optionName].default_value}
                      allowed_values={options[optionName].allowed_values}
                      readOnly={readOnly}
                    />
                  </ReqorePanel>
                </div>
              </SubField>
            </StyledOptionField>
          ) : null
        )}
      </div>
      {size(fixedValue) === 0 && (
        <ReqoreMessage intent="info" inverted flat size="small">
          {noValueString || 'No options selected. Please add options from the list.'}
        </ReqoreMessage>
      )}
      <Spacer size={10} />
      {size(filteredOptions) >= 1 && !readOnly ? (
        <SelectField
          name="options"
          defaultItems={Object.keys(filteredOptions).map((option) => ({
            name: option,
            desc: options[option].desc,
          }))}
          onChange={(_name, value) => addSelectedOption(value)}
          placeholder={`${placeholder || 'Add new option'} (${size(filteredOptions)})`}
        />
      ) : null}
    </>
  );
};

export default Options;
