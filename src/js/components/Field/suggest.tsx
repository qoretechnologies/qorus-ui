import { size } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import AutoComplete from 'react-autocomplete';
import { findBy } from '../../helpers/search';

export interface ISuggestField {
  defaultItems?: any[];
  predicate: (name: string) => boolean;
  placeholder: string;
  fill?: boolean;
  disabled?: boolean;
  position?: any;
  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'IField'.
  requestFieldData: (name: string, key: string) => IField;
  messageData: any;
  warningMessageOnEmpty?: string;
  autoSelect?: boolean;
}

const SuggestField: FunctionComponent<ISuggestField> = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'get_message' does not exist on type 'Pro... Remove this comment to see the full error message
  get_message,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'return_message' does not exist on type '... Remove this comment to see the full error message
  return_message,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'addMessageListener' does not exist on ty... Remove this comment to see the full error message
  addMessageListener,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'postMessage' does not exist on type 'Pro... Remove this comment to see the full error message
  postMessage,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'PropsWithC... Remove this comment to see the full error message
  name,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onChange' does not exist on type 'PropsW... Remove this comment to see the full error message
  onChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'PropsWith... Remove this comment to see the full error message
  value,
  defaultItems,
  // @ts-ignore ts-migrate(2339) FIXME: Property 't' does not exist on type 'PropsWithChil... Remove this comment to see the full error message
  t,
  predicate,
  placeholder,
  fill,
  disabled,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'selected' does not exist on type 'PropsW... Remove this comment to see the full error message
  selected,
  requestFieldData,
  warningMessageOnEmpty,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'onSelect' does not exist on type 'PropsW... Remove this comment to see the full error message
  onSelect,
  autoSelect,
}) => {
  const [items, setItems] = useState(defaultItems || []);

  useEffect(() => {
    if (defaultItems) {
      setItems(defaultItems);
    }
  }, [defaultItems]);

  const handleChange: (item: any) => void = (item) => {
    if (item === value) {
      return;
    }
    // Set the selected item
    onChange(name, item);
  };

  return (
    <AutoComplete
      getItemValue={(item) => item}
      wrapperProps={{
        style: {
          display: 'flex',
          flexFlow: 'column',
          overflow: 'hidden',
          flex: 1,
        },
      }}
      open={selected !== value}
      inputProps={{
        placeholder: 'Search for a type',
        style: {
          width: '100%',
          height: '30px',
          outline: 'none',
          border: 'none',
          borderRadius: '3px',
          boxShadow:
            '0 0 0 0 rgba(92, 112, 128, 0), 0 0 0 0 rgba(92, 112, 128, 0), inset 0 0 0 1px rgba(16, 22, 26, 0.15), inset 0 1px 1px rgba(16, 22, 26, 0.2)',
          background: '#ffffff',
          padding: '0 10px',
          verticalAlign: 'middle',
          lineHeight: '30px',
          color: '#182026',
          fontSize: '14px',
          fontWeight: '400',
          transition: 'box-shadow 100ms cubic-bezier(0.4, 1, 0.75, 0.9)',
        },
        name: `field-${name}`,
      }}
      menuStyle={{
        borderRadius: '3px',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        border: '1px solid #eee',
        borderTop: 0,
        overflowY: 'auto',
        maxHeight: value ? '300px' : undefined,
      }}
      items={items}
      value={value}
      onChange={(e) => {
        onSelect(null);
        handleChange(e.target.value);
      }}
      onSelect={(val) => {
        handleChange(null);
        onSelect(val);
      }}
      renderItem={(item, isHighlighted) => (
        <div
          style={{
            padding: '0 10px',
            height: '30px',
            lineHeight: '30px',
            backgroundColor: isHighlighted ? '#eee' : '#fff',
            cursor: 'pointer',
          }}
        >
          {item}
        </div>
      )}
      shouldItemRender={(item, value) => {
        return size(findBy('name', value, [{ name: item }])) > 0;
      }}
    />
  );
};

export default SuggestField;
