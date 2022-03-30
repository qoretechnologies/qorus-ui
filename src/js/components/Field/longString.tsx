import { Classes, TextArea } from '@blueprintjs/core';
import React from 'react';
import { getLineCount } from '../../helpers/system';

export interface ILongStringField {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'TTranslator'.
  t?: TTranslator;
  fill?: boolean;
  placeholder?: string;
  noWrap?: boolean;
}

const LongStringField = ({
  name,
  onChange,
  value,
  default_value,
  fill,
  placeholder,
  noWrap,
}) => {
  // When input value changes
  const handleInputChange = (event): void => {
    onChange(name, event.target.value);
  };

  return (
    <TextArea
      name={`field-${name}`}
      style={{
        width: '100%',
        resize: 'none',
        whiteSpace: noWrap ? 'nowrap' : undefined,
      }}
      placeholder={placeholder}
      rows={getLineCount(value || default_value || '') + 1}
      className={fill && Classes.FILL}
      value={!value ? default_value || '' : value}
      onChange={handleInputChange}
    />
  );
};

export default LongStringField;
