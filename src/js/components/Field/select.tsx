import React, { useState, useEffect } from 'react';
import { Select } from '@blueprintjs/select';
import { MenuItem, Button, Callout } from '@blueprintjs/core';
import { includes } from 'lodash';

export interface ISelectField {
  defaultItems?: any[];
  predicate: (name: string) => boolean;
  placeholder: string;
  fill?: boolean;
  disabled?: boolean;
  position?: any;
  requestFieldData: (name: string, key: string) => any;
  messageData: any;
  warningMessageOnEmpty?: string;
}

const SelectField = ({
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
  requestFieldData,
  warningMessageOnEmpty,
}) => {
  const [items, setItems] = useState(defaultItems || []);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (defaultItems) {
      setItems(defaultItems);
    }
  }, [defaultItems]);

  const handleSelectClick: (item: any) => void = item => {
    // Set the selected item
    onChange(name, item.name);
  };

  if (items.length === 0 && !value) {
    return (
      <Callout intent="warning">
        {warningMessageOnEmpty || 'SelectNoItems'}
      </Callout>
    );
  }

  // Filter the items
  let filteredItems: any[] =
    query === ''
      ? items
      : items.filter((item: any) =>
          includes(item.name.toLowerCase(), query.toLowerCase())
        );

  // If we should run the items thru predicate
  if (predicate) {
    filteredItems = filteredItems.filter(item => predicate(item.name));
  }

  return (
    <Select
      items={filteredItems}
      itemRenderer={(item, data) => (
        <MenuItem
          title={item.desc}
          icon={value && item.name === value ? 'tick' : 'blank'}
          text={item.name}
          onClick={data.handleClick}
        />
      )}
      inputProps={{
        placeholder: 'Filter',
      }}
      popoverProps={{
        popoverClassName: 'custom-popover',
        targetClassName: fill ? 'select-popover' : '',
        position: 'left',
      }}
      className={fill ? 'select-field' : ''}
      onItemSelect={(item: any) => handleSelectClick(item)}
      query={query}
      onQueryChange={(newQuery: string) => setQuery(newQuery)}
      disabled={disabled}
    >
      <Button
        text={value || placeholder || 'PleaseSelect'}
        rightIcon={'caret-down'}
      />
    </Select>
  );
};

export default SelectField;
