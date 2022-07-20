import { Callout, Classes, Icon } from '@blueprintjs/core';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import React, { useState } from 'react';
import useMount from 'react-use/lib/useMount';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { isObject } from 'util';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import Spacer from '../Spacer';
import AutoField from './auto';
import SelectField from './select';
import SubField from './subfield';

/* "Fix options to be an object with the correct type." */
export const fixOptions = (value, options) => {
  return reduce(
    value,
    (newValue, option, optionName) => {
      if (!isObject(option)) {
        return {
          ...newValue,
          [optionName]: {
            type: isArray(options[optionName].type)
              ? options[optionName].type[0]
              : options[optionName].type,
            value: option,
          },
        };
      }

      return { ...newValue, [optionName]: option };
    },
    {}
  );
};

const Options = ({ name, value, onChange, url, customUrl, ...rest }) => {
  const [options, setOptions] = useState({});
  //const [selectedOptions, setSelectedOptions] = useState(null);
  const [error, setError] = useState(null);

  const getUrl = () => customUrl || `${settings.REST_BASE_URL}/options/${url}`;

  useMount(() => {
    (async () => {
      // Fetch the options for this mapper type
      const data = await get(`/${getUrl()}`);

      if (data.err) {
        setError(data.desc);
        return;
      }
      setOptions({});
      onChange(name, fixOptions(value, data));
      // Save the new options
      setOptions(data);
    })();
  });

  useUpdateEffect(() => {
    if (url) {
      (async () => {
        // Fetch the options for this mapper type
        const data = await get(`/${getUrl()}`);
        if (data.err) {
          setError(data.desc);
          return;
        }
        setError(null);
        removeValue();
        // Save the new options
        setOptions(data);
        onChange(name, fixOptions({}, data));
      })();
    }
  }, [url]);

  const handleValueChange = (optionName, val, type) => {
    onChange(name, {
      ...value,
      [optionName]: {
        type,
        value: val,
      },
    });
  };

  const removeValue = () => {
    onChange(name, null);
  };

  const addSelectedOption = (optionName) => {
    handleValueChange(
      optionName,
      null,
      getTypeAndCanBeNull(options[optionName].type, options[optionName].allowed_values).type
    );
  };

  const removeSelectedOption = (optionName) => {
    delete value[optionName];

    onChange(name, value);
  };

  if (error) {
    return (
      <Callout intent="danger">
        <p style={{ fontWeight: 500 }}>{'Error Loading Options'}</p>
        {error}
      </Callout>
    );
  }

  if (!options) {
    return <p>{'Loading Options'}</p>;
  }

  if (!size(options)) {
    return <p>{'NoOptionsAvailable'}</p>;
  }

  const filteredOptions = reduce(
    options,
    (newOptions, option, name) => {
      if (value && value[name]) {
        return newOptions;
      }

      return { ...newOptions, [name]: option };
    },
    {}
  );

  const getTypeAndCanBeNull = (type, allowed_values) => {
    let canBeNull = false;
    let realType = isArray(type) ? type[0] : type;

    if (realType?.startsWith('*')) {
      realType = realType.replace('*', '');
      canBeNull = true;
    }

    realType = realType === 'string' && allowed_values ? 'select-string' : realType;

    return {
      type: realType,
      defaultType: realType,
      defaultInternalType: realType,
      canBeNull,
    };
  };

  return (
    <>
      {map(fixOptions(value, options), ({ type, ...rest }, optionName) =>
        !!options[optionName] ? (
          <SubField
            title={rest.name || optionName}
            desc={options[optionName].desc}
            onRemove={() => {
              removeSelectedOption(optionName);
            }}
          >
            <AutoField
              {...getTypeAndCanBeNull(type, options[optionName].allowed_values)}
              name={optionName}
              onChange={(optionName, val) => {
                if (val !== undefined) {
                  handleValueChange(
                    optionName,
                    val,
                    getTypeAndCanBeNull(type, options[optionName].allowed_values).type
                  );
                }
              }}
              value={rest.value}
              sensitive={options[optionName].sensitive}
              default_value={options[optionName].default}
              allowed_values={options[optionName].allowed_values}
            />
          </SubField>
        ) : null
      )}
      {size(value) === 0 && (
        <p className={Classes.TEXT_MUTED}>
          <Icon icon="info-sign" /> {'No Options Selected'}
        </p>
      )}
      <Spacer size={10} />
      {size(filteredOptions) >= 1 && (
        // @ts-ignore ts-migrate(2740) FIXME: Type '{ name: string; defaultItems: { name: string... Remove this comment to see the full error message
        <SelectField
          name="options"
          defaultItems={Object.keys(filteredOptions).map((option) => ({
            name: option,
            desc: options[option].desc,
          }))}
          onChange={(_name, value) => addSelectedOption(value)}
          placeholder={`Add New Option (${size(filteredOptions)})`}
        />
      )}
    </>
  );
};

export default Options;
