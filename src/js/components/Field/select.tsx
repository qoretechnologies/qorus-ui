import { Button, Classes, Icon } from '@blueprintjs/core';
import {
  ReqoreButton,
  ReqoreControlGroup,
  ReqoreDropdown,
  ReqoreMessage,
  ReqorePopover,
} from '@qoretechnologies/reqore';
import { TReqoreIntent } from '@qoretechnologies/reqore/dist/constants/theme';
import { includes } from 'lodash';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Spacer from '../Spacer';
import CustomDialog from './CustomDialog';
import StringField from './string';

export interface ISelectField {
  defaultItems?: any[];
  predicate: (name: string) => boolean;
  placeholder: string;
  fill?: boolean;
  disabled?: boolean;
  position?: any;
  requestFieldData: (name: string, key?: string) => any;
  messageData: any;
  warningMessageOnEmpty?: string;
  autoSelect?: boolean;
  intent?: TReqoreIntent;
}

export const StyledDialogSelectItem = styled.div`
  margin-bottom: 10px;
  max-height: 150px;
  overflow: hidden;
  position: relative;

  &:before {
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
    // Linear gradient from top transparent to bottom white
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 1) 100%
    );
    z-index: 10;
  }

  background-color: #fff;

  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  transition: all 0.2s;

  &:hover,
  &.selected {
    cursor: pointer;
    transform: scale(0.98);
    box-shadow: 0 0 10px -6px #555;
  }

  &.selected {
    border: 2px solid #7fba27;
  }

  h5 {
    margin: 0;
    padding: 0;
    font-size: 14px;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 12px;
  }
`;

const SelectField = ({
  name,
  onChange,
  value,
  defaultItems,
  predicate,
  placeholder,
  fill,
  disabled,
  requestFieldData,
  autoSelect,
  iface_kind,
  context,
  editOnly,
  target_dir,
  forceDropdown,
  intent,
}: ISelectField & any) => {
  const [items, setItems] = useState<any[]>(defaultItems || []);
  const [query, setQuery] = useState<string>('');
  const [isSelectDialogOpen, setSelectDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (defaultItems) {
      setItems(defaultItems);
    }
  }, [JSON.stringify(defaultItems)]);

  const handleEditSubmit: (_defaultName: string, val: string) => void = (_defaultName, val) => {
    handleSelectClick({ name: val });
  };

  const handleSelectClick: (item: any) => void = (item) => {
    if (item === value) {
      return;
    }
    // Set the selected item
    onChange(name, item.value || item.name);
  };

  let filteredItems: any[] = items;

  // If we should run the items thru predicate
  if (predicate) {
    filteredItems = filteredItems.filter((item) => predicate(item.name));
  }

  if (autoSelect && filteredItems.length === 1) {
    // Automaticaly select the first item
    if (filteredItems[0].name !== value) {
      handleSelectClick(filteredItems[0]);
    }
    // Show readonly string
    return (
      <StringField
        value={value || filteredItems[0].name}
        read_only
        name={name}
        onChange={() => {}}
      />
    );
  }

  const hasItemsWithDesc = (data) => {
    return data.some((item) => getItemDescription(item.name));
  };

  if (!filteredItems || filteredItems.length === 0) {
    return (
      <Button
        fill={fill}
        text={'No Data Available'}
        rightIcon={'caret-down'}
        icon="disable"
        disabled
      />
    );
  }

  const filterItems = (items) => {
    return items.filter((item: any) => includes(item.name.toLowerCase(), query.toLowerCase()));
  };

  const getItemDescription = (itemName) => {
    return items.find((item) => item.name === itemName)?.desc;
  };

  return (
    <>
      {!filteredItems || filteredItems.length === 0 ? (
        <StringField
          value={'Nothing To Select'}
          read_only
          disabled
          name={name}
          onChange={() => {}}
        />
      ) : (
        <ReqoreControlGroup style={{ flexFlow: 'column' }}>
          {hasItemsWithDesc(items) && !forceDropdown ? (
            <>
              <ReqoreButton
                flat
                rightIcon={'WindowFill'}
                onClick={() => setSelectDialogOpen(true)}
                disabled={disabled}
                intent={value ? 'info' : undefined}
              >
                {value ? value : placeholder || 'Please select'}
              </ReqoreButton>
              {isSelectDialogOpen && (
                <CustomDialog
                  isOpen
                  blur={5}
                  flat={false}
                  icon="ListOrdered"
                  onClose={() => {
                    setSelectDialogOpen(false);
                    setQuery('');
                  }}
                  title={'Select item to add'}
                >
                  <div style={{ padding: '10px' }}>
                    <div>
                      <StringField
                        onChange={(_name, value) => setQuery(value)}
                        value={query}
                        name="select-filter"
                        placeholder={'Filter'}
                        autoFocus
                      />
                      <Spacer size={10} />
                    </div>
                    <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                      {filterItems(filteredItems).map((item) => (
                        <ReqorePopover
                          key={item.name}
                          placement="top"
                          component={StyledDialogSelectItem}
                          content={<ReactMarkdown>{item.desc}</ReactMarkdown>}
                          componentProps={{
                            style: {
                              width: '100%',
                            },
                            className: item.name === value ? 'selected' : '',
                            onClick: () => {
                              handleSelectClick(item);
                              setSelectDialogOpen(false);
                              setQuery('');
                            },
                          }}
                        >
                          <h5>
                            {item.name === value && (
                              <Icon icon="small-tick" style={{ color: '#7fba27' }} />
                            )}{' '}
                            {item.name}
                          </h5>

                          <p className={Classes.TEXT_MUTED}>
                            <ReactMarkdown>{item.desc || 'NoDescription'}</ReactMarkdown>
                          </p>
                        </ReqorePopover>
                      ))}
                    </div>
                  </div>
                </CustomDialog>
              )}
            </>
          ) : (
            <ReqoreDropdown
              items={items.map((item) => ({
                label: item.name,
                value: item.name,
                selected: item.name === value,
                intent: item.name === value ? 'info' : undefined,
                onClick: () => handleSelectClick(item),
              }))}
              label={value ? value : placeholder || 'Please select'}
              closeOnOutsideClick
              filterable={false}
              caretPosition="right"
              disabled={disabled}
              flat
              intent={value ? 'info' : undefined}
            />
          )}
          <div>
            {getItemDescription(value) && (
              <ReqoreMessage inverted intent="info" flat size="small">
                {getItemDescription(value)}
              </ReqoreMessage>
            )}
          </div>
        </ReqoreControlGroup>
      )}
    </>
  );
};

export default SelectField;
