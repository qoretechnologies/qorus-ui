import { ReqoreInput } from '@qoretechnologies/reqore';
import { IReqoreInputProps } from '@qoretechnologies/reqore/dist/components/Input';
import { ChangeEvent } from 'react';
import useMount from 'react-use/lib/useMount';
import { isNull } from 'util';
import { getValueOrDefaultValue } from './validations';

export interface IStringField {
  fill?: boolean;
  read_only?: boolean;
  placeholder?: string;
  canBeNull?: boolean;
  sensitive?: boolean;
  autoFocus?: boolean;
  onChange?: (name: string, value: string) => void;
  name?: string;
  value?: string;
  default_value?: string;
  disabled?: boolean;
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
  sensitive,
  autoFocus,
}: IStringField & IReqoreInputProps & any) => {
  // Fetch data on mount
  useMount(() => {
    // Populate default value
    onChange && onChange(name, getValueOrDefaultValue(value, default_value, canBeNull));
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
    <ReqoreInput
      placeholder={placeholder}
      disabled={disabled}
      fluid={fill}
      value={
        canBeNull && isNull(value) ? 'Value set to [null]' : !value ? default_value || '' : value
      }
      onFocus={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onChange={handleInputChange}
      autoFocus={autoFocus}
      onClearClick={handleResetClick}
    />
  );
};

export default StringField;
