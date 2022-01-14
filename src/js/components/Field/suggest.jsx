import { size } from 'lodash';
import React, { FunctionComponent, useEffect, useState } from 'react';
import AutoComplete from 'react-autocomplete';
import { findBy } from '../../helpers/search';

export interface ISuggestField {
  defaultItems?: any[];
  predicate: (name: string) => boolean;
  placeholder: string;
  fill?: boolean;
  disabled?: boolean;
  position?: any;
  requestFieldData: (name: string, key: string) => IField;
  messageData: any;
  warningMessageOnEmpty?: string;
  autoSelect?: boolean;
}

const SuggestField: FunctionComponent<ISuggestField> = ({
  get_message,
  return_message,
  addMessageListener,
  postMessage,
  name,
  onChange,
  value,
  defaultItems,
  t,
  predicate,
  placeholder,
  fill,
  disabled,
  selected,
  requestFieldData,
  warningMessageOnEmpty,
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
