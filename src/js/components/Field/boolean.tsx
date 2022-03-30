import React, { FunctionComponent, FormEvent } from 'react';
import { Switch } from '@blueprintjs/core';
import useMount from 'react-use/lib/useMount';
import { getValueOrDefaultValue, maybeParseYaml } from './validations';
import { isUndefined } from 'util';

const BooleanField: FunctionComponent = ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type '{ children... Remove this comment to see the full error message
  name,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'onChange' does not exist on type '{ chil... Remove this comment to see the full error message
  onChange,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type '{ childre... Remove this comment to see the full error message
  value,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'default_value' does not exist on type '{... Remove this comment to see the full error message
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
