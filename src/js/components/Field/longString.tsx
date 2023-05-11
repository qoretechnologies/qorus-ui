import { ReqoreTextarea } from '@qoretechnologies/reqore';
import { ChangeEvent, FunctionComponent } from 'react';
import useMount from 'react-use/lib/useMount';
export interface ILongStringField {
  fill?: boolean;
  placeholder?: string;
  noWrap?: boolean;
}

export const getLineCount: Function = (value: string): number => {
  try {
    return value.match(/[^\n]*\n[^\n]*/gi).length;
  } catch (e) {
    return 0;
  }
};

const LongStringField: FunctionComponent<ILongStringField & any> = ({
  name,
  onChange,
  value,
  default_value,
  fill,
  get_message,
  return_message,
  placeholder,
  noWrap,
}) => {
  // Fetch data on mount
  useMount(() => {
    // Populate default value
    if (value || default_value) {
      onChange?.(name, value || default_value);
    }
  });

  // When input value changes
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    onChange?.(name, event.target.value);
  };

  return (
    <ReqoreTextarea
      style={{
        width: '100%',
        resize: 'none',
        whiteSpace: noWrap ? 'nowrap' : undefined,
      }}
      placeholder={placeholder}
      scaleWithContent
      fluid={fill}
      value={!value ? default_value || '' : value}
      onChange={handleInputChange}
    />
  );
};

export default LongStringField;
