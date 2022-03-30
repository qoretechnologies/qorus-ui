import React, { ChangeEvent } from 'react';
import { TextArea } from '@blueprintjs/core';
import useMount from 'react-use/lib/useMount';

const TextareaField = ({
  name,
  onChange,
  value,
  default_value,
  fill,
  placeholder,
}) => {
  // Fetch data on mount
  useMount(() => {
    // Populate default value
    if (default_value) {
      onChange(name, default_value);
    }
  });

  // When input value changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(name, event.target.value);
  };

  return (
    <TextArea
      placeholder={placeholder}
      fill={fill}
      value={!value ? default_value || '' : value}
      // @ts-expect-error ts-migrate(2322) FIXME: Type '(event: ChangeEvent<HTMLInputElement>) => vo... Remove this comment to see the full error message
      onChange={handleInputChange}
    />
  );
};

export default TextareaField;
