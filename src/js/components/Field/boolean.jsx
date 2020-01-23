import React, { FunctionComponent, FormEvent } from 'react';
import { Switch } from '@blueprintjs/core';
import useMount from 'react-use/lib/useMount';
import { getValueOrDefaultValue, maybeParseYaml } from './validations';
import { isUndefined } from 'util';

const BooleanField: FunctionComponent = ({
  name,
  onChange,
  value,
  default_value,
}) => {
  useMount(() => {
    // Set the default value
    onChange(
      name,
      getValueOrDefaultValue(maybeParseYaml(value), maybeParseYaml(default_value || false), false)
    );
  });

  const handleEnabledChange: (
    event: FormEvent<HTMLInputElement>
  ) => void = () => {
    // Run the onchange
    if (onChange) {
      onChange(name, !value);
    }
  };

  return (
    <Switch checked={value || false} large onChange={handleEnabledChange} />
  );
};

export default BooleanField;
