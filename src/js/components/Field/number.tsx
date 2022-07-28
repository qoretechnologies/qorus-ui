// @ts-nocheck
import { setupPreviews } from '@previewjs/plugin-react/setup';
import { ReqoreInput } from '@qoretechnologies/reqore';
import { ChangeEvent, FunctionComponent } from 'react';

export interface INumberField {
  fill?: boolean;
}

const NumberField: FunctionComponent<INumberField & any> = ({
  name,
  onChange,
  value,
  default_value,
  type,
  fill,
  disabled,
}) => {
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
    <ReqoreInput
      fluid={fill}
      disabled={disabled}
      value={value ?? default_value ?? ''}
      onChange={handleInputChange}
      onClearClick={handleResetClick}
      // @ts-expect-error
      type="number"
    />
  );
};

setupPreviews(NumberField, {
  Basic: {
    name: 'Basic',
    value: 23,
  },
});

export default NumberField;
