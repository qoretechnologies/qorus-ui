import { Button, ButtonGroup, Callout, Classes, Dialog, Spinner } from '@blueprintjs/core';
import { omit } from 'lodash';
import map from 'lodash/map';
import nth from 'lodash/nth';
import size from 'lodash/size';
import React, { useCallback, useState } from 'react';
import { useDebounce } from 'react-use';
import styled, { css } from 'styled-components';
import SelectField from '../../components/Field/select';
import String from '../../components/Field/string';
import { validateField } from '../../components/Field/validations';
import { get } from '../../store/api/utils';

const StyledWrapper = styled.div`
  margin-bottom: 10px;
  ${({ compact, hasTitle }) =>
    compact
      ? css`
          margin-top: ${hasTitle ? '10px' : 0};
        `
      : css`
          margin: 0 auto;
          text-align: center;
        `}
  > span {
    vertical-align: middle;
    font-weight: 500;
    line-height: 20px;
  }
`;

const StyledHeader = styled.h3`
  margin: 0;
  margin-bottom: 10px;
  text-align: center;
`;

export let providers = {
  type: {
    name: 'type',
    url: 'api/latest/dataprovider/types',
    suffix: '',
    recordSuffix: '?action=type',
    type: 'type',
  },
  connection: {
    name: 'connection',
    url: 'api/latest/remote/user',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'connection',
  },
  remote: {
    name: 'remote',
    url: 'api/latest/remote/qorus',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'remote',
  },
  datasource: {
    name: 'datasource',
    url: 'api/latest/remote/datasources',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'datasource',
  },
  factory: {
    name: 'factory',
    url: 'api/latest/dataprovider/factories',
    filter: null,
    inputFilter: null,
    outputFilter: null,
    suffix: '/provider',
    namekey: 'name',
    desckey: 'desc',
    recordSuffix: '/record',
    requiresRecord: true,
    suffixRequiresOptions: true,
    type: 'factory',
  },
};

export const configItemFactory = {
  name: 'factory',
  url: 'api/latest/dataprovider/factories',
  filter: null,
  inputFilter: null,
  outputFilter: null,
  suffix: '/provider',
  namekey: 'name',
  desckey: 'desc',
  recordSuffix: '',
  requiresRecord: false,
  suffixRequiresOptions: true,
  type: 'factory',
};

const MapperProvider = ({
  provider,
  setProvider,
  nodes,
  setChildren,
  isLoading,
  setIsLoading,
  record,
  setRecord,
  setFields,
  clear,
  setMapperKeys,
  setOptionProvider,
  title,
  type,
  hide,
  compact,
  canSelectNull,
  style,
  isConfigItem,
  options,
  optionsChanged,
}) => {
  const [wildcardDiagram, setWildcardDiagram] = useState(null);
  const [optionString, setOptionString] = useState('');

  /* When the options hash changes, we want to update the query string. */
  useDebounce(
    () => {
      if (size(options)) {
        // Turn the options hash into a query string
        const str = map(options, (value, key) => `${key}=${btoa(value.value)}`).join(',');
        setOptionString(`provider_yaml_options={${str}}`);
      } else {
        setOptionString('provider_yaml_options={}');
      }
    },
    500,
    [options]
  );

  // Omit type and factory from the list of providers if is config item
  providers = isConfigItem
    ? { ...omit(providers, ['type', 'factory']), factory: configItemFactory }
    : providers;

  const handleProviderChange = (provider) => {
    setProvider((current) => {
      // Fetch the url of the provider
      (async () => {
        // Clear the data
        clear && clear(true);
        // Set loading
        setIsLoading(true);
        // Select the provider data
        const { url, filter, inputFilter, outputFilter } = providers[provider];
        // Get the data
        let data = await get(url);
        console.log(data);
        // Remove loading
        setIsLoading(false);
        // Filter unwanted data if needed
        if (filter) {
          data = data.filter((datum) => datum[filter]);
        }
        // Filter input filters and output filters
        if (type === 'inputs' || type === 'outputs') {
          if (type === 'inputs' && inputFilter) {
            data = data.filter((datum) => datum[inputFilter]);
          }
          if (type === 'outputs' && outputFilter) {
            data = data.filter((datum) => datum[outputFilter]);
          }
        }
        // Save the children
        let children = data.children || data;
        // Add new child
        setChildren([
          {
            values: children.map((child) => ({
              name: providers[provider].namekey ? child[providers[provider].namekey] : child,
              desc: '',
              url,
              suffix: providers[provider].suffix,
            })),
            value: null,
          },
        ]);
      })();
      // Set the provider
      return provider;
    });
  };

  const handleChildFieldChange: (
    value: string,
    url: string,
    itemIndex: number,
    suffix?: string
  ) => void = async (value, url, itemIndex, suffix) => {
    // Clear the data
    clear && clear(true);
    // Set loading
    setIsLoading(true);
    // Build the suffix
    let suffixString = providers[provider].suffixRequiresOptions
      ? optionString && optionString !== '' && size(options)
        ? `${suffix}?${optionString}`
        : itemIndex === 1
        ? ''
        : suffix
      : suffix;
    // Fetch the data
    const data = await get(`${url}/${value}${suffixString}`);
    // Reset loading
    setIsLoading(false);
    // Add new child
    setChildren((current) => {
      // Update this item
      const newItems: any[] = current
        .map((item, index) => {
          const newItem = { ...item };
          // Update the value if the index matches
          if (index === itemIndex) {
            newItem.value = value;
          }
          // Also check if there are items with
          // higher index (children) and remove them
          if (index > itemIndex) {
            return null;
          }
          // Return the item
          return newItem;
        })
        .filter((item) => item);
      if (data.has_type || isConfigItem) {
        (async () => {
          setIsLoading(true);
          if (type === 'outputs' && data.mapper_keys) {
            // Save the mapper keys
            setMapperKeys && setMapperKeys(data.mapper_keys);
          }

          suffixString = providers[provider].suffixRequiresOptions
            ? optionString && optionString !== '' && size(options)
              ? `${suffix}${providers[provider].recordSuffix}?${optionString}${
                  type === 'outputs' ? '&soft=true' : ''
                }`
              : `${suffix}`
            : `${suffix}${providers[provider].recordSuffix}`;
          console.log(url, value, suffixString);
          // Fetch the record
          const record = await get(`${url}/${value}${suffixString}`);
          // Remove loading
          setIsLoading(false);
          // Save the name by pulling the 3rd item from the split
          // url (same for every provider type)
          const name = `${url}/${value}`.split('/')[4];
          // Set the provider option
          setOptionProvider({
            type: providers[provider].type,
            name,
            can_manage_fields: record.can_manage_fields,
            path: `${url}/${value}`
              .replace(`${name}`, '')
              .replace(`${providers[provider].url}/`, '')
              .replace('provider/', ''),
            options,
          });
          if (data.has_type || isConfigItem) {
            // Set the record data
            setRecord && setRecord(!providers[provider].requiresRecord ? record.fields : record);
          }
          //
        })();
      }
      // If this provider has children
      if (size(data.children)) {
        // Return the updated items and add
        // the new item
        return [
          ...newItems,
          {
            values: data.children.map((child) => ({
              name: child,
              desc: '',
              url: `${url}/${value}${suffix}`,
              suffix: '',
            })),
            value: null,
          },
        ];
      } else if (data.supports_request) {
        // Return the updated items and add
        // the new item
        return [
          ...newItems,
          {
            values: [
              {
                name: 'request',
                desc: '',
                url: `${url}/${value}${suffix}`,
                suffix: '',
              },
              {
                name: 'response',
                desc: '',
                url: `${url}/${value}${suffix}`,
                suffix: '',
              },
            ],
            value: null,
          },
        ];
      }
      // Return the updated children
      else {
        if (data.fields) {
          // Save the name by pulling the 3rd item from the split
          // url (same for every provider type)
          const name = `${url}/${value}`.split('/')[4];
          // Set the provider option
          setOptionProvider({
            type: providers[provider].type,
            can_manage_fields: data.can_manage_fields,
            name,
            subtype: value === 'request' || value === 'response' ? value : undefined,
            path: `${url}/${value}`
              .replace(`${name}`, '')
              .replace(`${providers[provider].url}/`, '')
              .replace('provider/', '')
              .replace('request', '')
              .replace('response', ''),
          });
          // Set the record data
          setRecord && setRecord(data.fields);
        }
        // Check if there is a record
        else if (isConfigItem || data.has_record || !providers[provider].requiresRecord) {
          (async () => {
            setIsLoading(true);
            if (type === 'outputs' && data.mapper_keys) {
              // Save the mapper keys
              setMapperKeys && setMapperKeys(data.mapper_keys);
            }
            suffixString = providers[provider].suffixRequiresOptions
              ? optionString && optionString !== '' && size(options)
                ? `${suffix}${providers[provider].recordSuffix}?${optionString}${
                    type === 'outputs' ? '&soft=true' : ''
                  }`
                : suffix
              : `${suffix}${providers[provider].recordSuffix}`;
            // Fetch the record
            const record = await get(`${url}/${value}${suffix}${suffixString}`);
            // Remove loading
            setIsLoading(false);
            // Save the name by pulling the 3rd item from the split
            // url (same for every provider type)
            const name = `${url}/${value}`.split('/')[4];
            // Set the provider option
            setOptionProvider({
              type: providers[provider].type,
              name,
              can_manage_fields: record.can_manage_fields,
              path: `${url}/${value}`
                .replace(`${name}`, '')
                .replace(`${providers[provider].url}/`, '')
                .replace('provider/', ''),
              options,
            });
            // Set the record data
            setRecord && setRecord(!providers[provider].requiresRecord ? record.fields : record);
            //
          })();
        }

        return [...newItems];
      }
    });
  };

  const getDefaultItems = useCallback(
    () =>
      map(providers, ({ name }) => ({ name, desc: '' })).filter((prov) =>
        prov.name === 'null' ? canSelectNull : true
      ),
    []
  );

  return (
    <>
      {wildcardDiagram?.isOpen && (
        <Dialog title="Wildcard" isOpen isCloseButtonShown={false}>
          <div className={Classes.DIALOG_BODY}>
            <Callout intent="primary">{'Replace wildcard'}</Callout>
            <br />
            <String
              name="wildcard"
              onChange={(_name, value) => setWildcardDiagram((cur) => ({ ...cur, value }))}
              value={wildcardDiagram.value}
            />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                intent="success"
                disabled={!validateField('string', wildcardDiagram.value)}
                onClick={() => {
                  handleChildFieldChange(
                    wildcardDiagram.value,
                    wildcardDiagram.url,
                    wildcardDiagram.index,
                    wildcardDiagram.suffix
                  );
                  setWildcardDiagram(null);
                }}
                text={'Submit'}
              />
            </div>
          </div>
        </Dialog>
      )}
      <StyledWrapper compact={compact} hasTitle={!!title} style={style}>
        {!compact && <StyledHeader>{title}</StyledHeader>}
        {compact && title && <span>{title}: </span>}{' '}
        <ButtonGroup>
          <SelectField
            name={`provider${type ? `-${type}` : ''}`}
            disabled={isLoading}
            defaultItems={getDefaultItems()}
            onChange={(_name, value) => {
              handleProviderChange(value);
            }}
            value={provider}
          />
          {nodes.map((child, index) => (
            <ButtonGroup>
              <SelectField
                key={`${title}-${index}`}
                name={`provider-${type ? `${type}-` : ''}${index}`}
                disabled={isLoading}
                defaultItems={child.values}
                onChange={(_name, value) => {
                  // Get the child data
                  const { url, suffix } = child.values.find((val) => val.name === value);
                  // If the value is a wildcard present a dialog that the user has to fill
                  if (value === '*') {
                    setWildcardDiagram({
                      index,
                      isOpen: true,
                      url,
                      suffix,
                    });
                  } else {
                    // Change the child
                    handleChildFieldChange(value, url, index, suffix);
                  }
                }}
                value={child.value}
              />
              {index === 0 && optionsChanged ? (
                <Button
                  icon="refresh"
                  intent="success"
                  onClick={() => {
                    // Get the child data
                    const { url, suffix } = child.values.find((val) => val.name === child.value);
                    // If the value is a wildcard present a dialog that the user has to fill
                    if (child.value === '*') {
                      setWildcardDiagram({
                        index: 0,
                        isOpen: true,
                        url,
                        suffix,
                      });
                    } else {
                      // Change the child
                      handleChildFieldChange(child.value, url, 0, suffix);
                    }
                  }}
                >
                  {' '}
                  Apply options{' '}
                </Button>
              ) : null}
            </ButtonGroup>
          ))}
          {isLoading && <Spinner size={15} />}
          {nodes.length > 0 && (
            <Button
              intent="danger"
              name={`provider-${type ? `${type}-` : ''}back`}
              icon="step-backward"
              onClick={() => {
                /*
                If the last child is a wildcard, open a dialog that allows the user to fill in the
                wildcard. Otherwise, change the child.

                Args:
                  cur: The current value of the children field.
                Returns:
                  The new array of children.
                */
                setChildren((cur) => {
                  const result = [...cur];

                  result.pop();

                  const lastChild = nth(result, -2);

                  if (lastChild) {
                    const index = size(result) - 2;
                    const { value, values } = lastChild;
                    const { url, suffix } = values.find((val) => val.name === value);

                    // If the value is a wildcard present a dialog that the user has to fill
                    if (value === '*') {
                      setWildcardDiagram({
                        index,
                        isOpen: true,
                        url,
                        suffix,
                      });
                    } else {
                      // Change the child
                      handleChildFieldChange(value, url, index, suffix);
                    }
                  }

                  // If there are no children then we need to reset the provider
                  if (size(result) === 0) {
                    handleProviderChange(provider);
                  }

                  return result;
                });
              }}
            />
          )}
          {record && (
            <Button
              intent="success"
              name={`provider-${type ? `${type}-` : ''}submit`}
              icon="small-tick"
              onClick={() => {
                setFields(record);
                hide();
              }}
            />
          )}
        </ButtonGroup>
      </StyledWrapper>
    </>
  );
};

export default MapperProvider;
