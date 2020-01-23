import React, { ChangeEvent } from 'react';
import { InputGroup, ButtonGroup, Button, Classes } from '@blueprintjs/core';
import useMount from 'react-use/lib/useMount';
import { getValueOrDefaultValue } from './validations';
import { isNull } from 'util';

export interface IStringField {
  fill?: boolean;
  read_only?: boolean;
  placeholder?: string;
  canBeNull?: boolean;
}

const StringField = ({
  name,
  onChange,
  value,
  default_value,
  fill,
  read_only,
  disabled,
  placeholder,
  canBeNull,
}) => {
  // Fetch data on mount
  useMount(() => {
    // Populate default value
    onChange(name, getValueOrDefaultValue(value, default_value, canBeNull));
  });

  // When input value changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(name, event.target.value);
  };

  // Clear the input on reset click
  const handleResetClick = (): void => {
    onChange(name, '');
  };

  return (
    <InputGroup
      placeholder={placeholder}
      disabled={disabled}
      readOnly={read_only}
      className={fill && Classes.FILL}
      value={
        canBeNull && isNull(value)
          ? 'Value set to [null]'
          : !value
          ? default_value || ''
          : value
      }
      onChange={handleInputChange}
      rightElement={
        value &&
        value !== '' &&
        !read_only &&
        !disabled && (
          <ButtonGroup minimal>
            <Button onClick={handleResetClick} icon={'cross'} />
          </ButtonGroup>
        )
      }
    />
  );
};

export default StringField;
