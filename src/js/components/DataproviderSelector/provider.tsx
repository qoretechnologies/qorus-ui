import { Button, Callout, Classes } from '@blueprintjs/core';
import { ReqoreButton, ReqoreControlGroup } from '@qoretechnologies/reqore';
import { cloneDeep, omit } from 'lodash';
import map from 'lodash/map';
import nth from 'lodash/nth';
import size from 'lodash/size';
import { useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import styled, { css } from 'styled-components';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import CustomDialog from '../Field/CustomDialog';
import SelectField from '../Field/select';
import String from '../Field/string';
import { validateField } from '../Field/validations';

export interface IProviderProps {
  type: 'inputs' | 'outputs' | 'event' | 'input-output' | 'condition';
  provider: string;
  setProvider: any;
  nodes: any[];
  setChildren: any;
  isLoading: boolean;
  setIsLoading: any;
  record?: any;
  setRecord?: any;
  setFields?: any;
  clear?: any;
  title?: string;
  setOptionProvider?: any;
  hide?: any;
  style: any;
  isConfigItem?: boolean;
  requiresRequest?: boolean;
  isRecordSearch?: boolean;
  options?: { [key: string]: any };
  optionsChanged?: boolean;
  setMapperKeys?: any;
  compact?: boolean;
  canSelectNull?: boolean;
  readOnly?: boolean;
}

const StyledWrapper = styled.div<{ compact?: boolean; hasTitle: boolean }>`
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

export const providers: any = {
  type: {
    name: 'type',
    url: 'dataprovider/types',
    suffix: '',
    recordSuffix: '?action=type',
    type: 'type',
    withDetails: true,
    desc: 'Data type and custom record descriptions',
  },
  connection: {
    name: 'connection',
    url: 'remote/user',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'connection',
    desc: 'Qorus user connections; access a data provider through a user connection',
  },
  remote: {
    name: 'remote',
    url: 'remote/qorus',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'remote',
    desc: 'Qorus to Qorus remote connections; access a data provider through a remote Qorus instances (remote datasources and remote Qorus APIs)',
  },
  datasource: {
    name: 'datasource',
    url: 'remote/datasources',
    filter: 'has_provider',
    namekey: 'name',
    desckey: 'desc',
    suffix: '/provider',
    recordSuffix: '/record',
    requiresRecord: true,
    type: 'datasource',
    desc: 'Qorus database connections; access record-based data providers through a local datasource',
  },
  factory: {
    name: 'factory',
    url: 'dataprovider/factories',
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
    desc: 'Data provider factories for creating data providers from options',
  },
};

export const configItemFactory = {
  name: 'factory',
  url: 'dataprovider/factories',
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
  desc: 'Data provider factories for creating data providers from options',
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
  requiresRequest,
  isRecordSearch,
  optionsChanged,
  onReset,
  optionProvider,
  recordType,
  readOnly,
}: any) => {
  const [wildcardDiagram, setWildcardDiagram] = useState(null);
  const [optionString, setOptionString] = useState('');
  const [descriptions, setDescriptions] = useState<string[]>([]);

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

  let realProviders = cloneDeep(providers);

  // Omit type and factory from the list of realProviders if is config item
  if (isConfigItem) {
    realProviders = omit(realProviders, ['type', 'factory']);
    realProviders.factory = configItemFactory;
  }

  if (requiresRequest) {
    realProviders = omit(realProviders, ['datasource', 'type']);
  }

  if (recordType) {
    realProviders = omit(realProviders, ['type']);
  }

  const handleProviderChange = (provider) => {
    setProvider((current) => {
      // Fetch the url of the provider
      (async () => {
        // Clear the data
        clear && clear(true);
        // Set loading
        setIsLoading(true);
        // Select the provider data
        const { url, filter, inputFilter, outputFilter, withDetails } = realProviders[provider];
        // Get the data
        let data = await get(
          `${settings.REST_BASE_URL}/${url}${withDetails ? '/childDetails' : ''}`
        );
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
        const children = data.children || data;
        // Add new child
        setChildren([
          {
            values: children.map((child) => {
              if (typeof child === 'string') {
                return {
                  name: realProviders[provider].namekey
                    ? child[realProviders[provider].namekey]
                    : child,
                  desc: '',
                  url,
                  suffix: realProviders[provider].suffix,
                };
              }

              return {
                ...child,
                url,
                suffix: realProviders[provider].suffix,
              };
            }),
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
    const newSuffix = `${suffix}/childDetails`;
    // Build the suffix
    let suffixString = realProviders[provider].suffixRequiresOptions
      ? optionString && optionString !== '' && size(options)
        ? `${newSuffix}?${optionString}`
        : itemIndex === 1
        ? ''
        : newSuffix
      : newSuffix;
    // Fetch the data
    const data = await get(`${settings.REST_BASE_URL}/${url}/${value}${suffixString}`);
    // Reset loading
    setIsLoading(false);

    /* Setting the state of the descriptions hash. */
    if (data.desc) {
      // Add the description to the descriptions hash
      setDescriptions((current): string[] => {
        const newData = [...current];
        newData[itemIndex] = data.desc;
        return newData;
      });
    }
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

      if (
        data.has_type ||
        isConfigItem ||
        provider === 'factory' ||
        (requiresRequest && data.supports_request)
      ) {
        (async () => {
          setIsLoading(true);
          if (type === 'outputs' && data.mapper_keys) {
            // Save the mapper keys
            setMapperKeys && setMapperKeys(data.mapper_keys);
          }
          const newSuffix = `${suffix}/childDetails`;
          suffixString = realProviders[provider].suffixRequiresOptions
            ? optionString && optionString !== '' && size(options)
              ? `${suffix}${realProviders[provider].recordSuffix}?${optionString}${
                  type === 'outputs' ? '&soft=true' : ''
                }`
              : `${newSuffix}`
            : `${suffix}${realProviders[provider].recordSuffix}`;

          // Fetch the record
          const record = await get(`${settings.REST_BASE_URL}/${url}/${value}${suffixString}`);
          // Remove loading
          setIsLoading(false);
          // Save the name by pulling the 3rd item from the split
          // url (same for every provider type)
          const name = `${url}/${value}`.split('/')[2];
          // Set the provider option
          setOptionProvider({
            type: realProviders[provider].type,
            name,
            is_api_call: requiresRequest,
            supports_request: data.supports_request,
            supports_read: data.supports_read,
            supports_update: data.supports_update,
            supports_create: data.supports_create,
            supports_delete: data.supports_delete,
            can_manage_fields: record?.can_manage_fields,
            descriptions: [...(optionProvider?.descriptions || []), ...descriptions, data.desc],
            path: `${url}/${value}`
              .replace(`${name}`, '')
              .replace(`${realProviders[provider].url}/`, '')
              .replace('provider/', ''),
            options,
          });
          if (data.has_type || isConfigItem) {
            // Set the record data
            setRecord &&
              setRecord(!realProviders[provider].requiresRecord ? record.fields : record);
            //
          }
        })();
      }
      // If this provider has children
      if (size(data.children)) {
        // Return the updated items and add
        // the new item
        return [
          ...newItems,
          {
            values: data.children.map((child) => {
              if (typeof child === 'string') {
                return {
                  name: child,
                  desc: 'No description provided',
                  url: `${url}/${value}${suffix}`,
                  suffix: '',
                };
              }

              return {
                ...child,
                url: `${url}/${value}${suffix}`,
                suffix: '',
              };
            }),
            value: null,
          },
        ];
      } else if (data.supports_request && !requiresRequest) {
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
          const name = `${url}/${value}`.split('/')[2];
          // Set the provider option
          setOptionProvider({
            type: realProviders[provider].type,
            can_manage_fields: data.can_manage_fields,
            supports_read: data.supports_read,
            supports_update: data.supports_update,
            supports_create: data.supports_create,
            supports_delete: data.supports_delete,
            name,
            descriptions: [...(optionProvider?.descriptions || []), ...descriptions, data.desc],
            subtype: value === 'request' || value === 'response' ? value : undefined,
            path: `${url}/${value}`
              .replace(`${name}`, '')
              .replace(`${realProviders[provider].url}/`, '')
              .replace('provider/', '')
              .replace('request', '')
              .replace('response', ''),
          });
          // Set the record data
          setRecord && setRecord(data.fields);
        }
        // Check if there is a record
        else if (isConfigItem || data.has_record || !realProviders[provider].requiresRecord) {
          (async () => {
            setIsLoading(true);
            if (type === 'outputs' && data.mapper_keys) {
              // Save the mapper keys
              setMapperKeys && setMapperKeys(data.mapper_keys);
            }
            suffixString = realProviders[provider].suffixRequiresOptions
              ? optionString && optionString !== '' && size(options)
                ? `${suffix}${realProviders[provider].recordSuffix}?${optionString}${
                    type === 'outputs' ? '&soft=true' : ''
                  }`
                : suffix
              : `${suffix}${realProviders[provider].recordSuffix}`;
            // Fetch the record
            const record = await get(`${settings.REST_BASE_URL}/${url}/${value}${suffixString}`);
            // Remove loading
            setIsLoading(false);
            // Save the name by pulling the 3rd item from the split
            // url (same for every provider type)
            const name = `${url}/${value}`.split('/')[2];
            // Set the provider option
            setOptionProvider({
              type: realProviders[provider].type,
              name,
              supports_read: data.supports_read,
              supports_update: data.supports_update,
              supports_create: data.supports_create,
              supports_delete: data.supports_delete,
              can_manage_fields: record.can_manage_fields,
              descriptions: [...(optionProvider?.descriptions || []), ...descriptions, data.desc],
              path: `${url}/${value}`
                .replace(`${name}`, '')
                .replace(`${realProviders[provider].url}/`, '')
                .replace('provider/', ''),
              options,
            });
            // Set the record data
            setRecord &&
              setRecord(!realProviders[provider].requiresRecord ? record.fields : record);
            //
          })();
        }

        return [...newItems];
      }
    });
  };

  const getDefaultItems = useMemo(
    () =>
      map(realProviders, ({ name, desc }) => ({ name, desc })).filter((prov) =>
        prov.name === 'null' ? canSelectNull : true
      ),
    []
  );

  return (
    <>
      {wildcardDiagram?.isOpen && (
        <CustomDialog title={'Wildcard'} isOpen>
          <div className={Classes.DIALOG_BODY}>
            <Callout intent="primary">{'Wildcard Replacement'}</Callout>
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
        </CustomDialog>
      )}
      <StyledWrapper compact={compact} hasTitle={!!title} style={style}>
        {!compact && <StyledHeader>{title}</StyledHeader>}
        {compact && title && <span>{title}: </span>}{' '}
        <ReqoreControlGroup stack fluid>
          <SelectField
            name={`provider${type ? `-${type}` : ''}`}
            disabled={readOnly || isLoading}
            defaultItems={getDefaultItems}
            onChange={(_name, value) => {
              handleProviderChange(value);
            }}
            value={provider}
          />
          {nodes.map((child, index) => (
            <>
              <SelectField
                key={`${title}-${index}`}
                name={`provider-${type ? `${type}-` : ''}${index}`}
                disabled={readOnly || isLoading}
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
                <ReqoreButton
                  flat
                  disabled={readOnly || isLoading}
                  icon="RefreshLine"
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
                </ReqoreButton>
              ) : null}
            </>
          ))}
          {isLoading && <ReqoreButton flat fixed intent="pending" icon="Loader3Line" />}
          {nodes.length > 0 && !readOnly ? (
            <>
              <ReqoreButton
                flat
                intent="warning"
                icon="DeleteBack2Fill"
                className={Classes.FIXED}
                onClick={() => {
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
              <ReqoreButton intent="danger" icon="DeleteBin2Fill" onClick={onReset} fixed flat />
            </>
          ) : null}
          {record && (
            <ReqoreButton
              flat
              intent="success"
              icon="CheckLine"
              onClick={() => {
                setFields(record);
                hide();
              }}
            />
          )}
        </ReqoreControlGroup>
      </StyledWrapper>
    </>
  );
};

export default MapperProvider;
