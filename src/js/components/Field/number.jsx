import React, { ChangeEvent } from 'react';
import { InputGroup, ButtonGroup, Button, Classes } from '@blueprintjs/core';
import useMount from 'react-use/lib/useMount';

const NumberField = ({ name, onChange, value, default_value, type, fill }) => {
  // Fetch data on mount
  useMount(() => {
    // Populate default value
    if (value || default_value) {
      onChange(name, value || default_value);
    }
  });

  // When input value changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(
      name,
      type === 'int' || type === 'number'
        ? parseInt(event.target.value, 10)
        : parseFloat(event.target.value)
    );
  };

  // Clear the input on reset click
  const handleResetClick = (): void => {
    onChange(name, null);
  };

  return (
    <InputGroup
      className={fill && Classes.FILL}
      value={!value ? default_value || '' : value}
      onChange={handleInputChange}
      type="number"
      step={type === 'int' || type === 'number' ? 1 : 0.1}
      rightElement={
        (value && value !== '') || value === 0 ? (
          <ButtonGroup minimal>
            <Button onClick={handleResetClick} icon={'cross'} />
          </ButtonGroup>
        ) : null
      }
    />
  );
};

export default NumberField;
