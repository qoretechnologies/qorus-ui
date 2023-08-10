import { Button, ButtonGroup, Intent, Spinner as _Spinner } from '@blueprintjs/core';
import map from 'lodash/map';
import size from 'lodash/size';
import { FC } from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import PaneItem from '../../../components/pane_item';
import settings from '../../../settings';
import { get } from '../../../store/api/utils';

const Spinner: any = _Spinner;

export interface IProviderProps {
  type: 'inputs' | 'outputs';
  provider: string;
  setProvider: any;
  nodes: any[];
  setChildren: any;
  isLoading: boolean;
  setIsLoading: any;
  record: any;
  setRecord: any;
  setFields: any;
  initialData: any;
  clear: any;
  title: string;
  setOptionProvider: any;
  hide: any;
}

export const providers = {
  type: {
    name: 'type',
    url: 'dataprovider/types',
    namekey: 'typename',
    desckey: 'name',
    suffix: '',
    recordSuffix: '',
    type: 'type',
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
  },
};

const DataProvider: FC<IProviderProps> = ({
  provider,
  setProvider,
  nodes,
  setChildren,
  isLoading,
  setIsLoading,
  record,
  setRecord,
  setFields,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'setData' does not exist on type 'PropsWi... Remove this comment to see the full error message
  setData,
  title,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'PropsWithC... Remove this comment to see the full error message
  intl,
}) => {
  const clear = () => {
    setRecord(null);
    setData(null);
  };
  const handleProviderChange = (provider) => {
    setProvider((current) => {
      // Fetch the url of the provider
      (async () => {
        // Clear the data
        // @ts-ignore ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
        clear(true);
        // Set loading
        setIsLoading(true);
        // Select the provider data
        const { url, filter } = providers[provider];
        // Get the data
        let data = await get(`${settings.REST_BASE_URL}/${url}`);
        // Remove loading
        setIsLoading(false);
        // Filter unwanted data if needed
        if (filter) {
          data = data.filter((datum) => datum[filter]);
        }
        // Add new child
        setChildren([
          {
            values: data.map((child) => ({
              name: child[providers[provider].namekey],
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
    // @ts-ignore ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    clear(true);
    // Set loading
    setIsLoading(true);
    // Fetch the data
    const data = await get(`${settings.REST_BASE_URL}/${url}/${value}${suffix}`);
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
        setData(data);
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
          setData(data);
          // Set the record data
          setRecord(data.fields);
        }
        // Check if there is a record
        else if (data.has_record || !providers[provider].requiresRecord) {
          (async () => {
            setIsLoading(true);
            // Fetch the record
            const record = await get(
              `${settings.REST_BASE_URL}/${url}/${value}${suffix}${providers[provider].recordSuffix}`
            );
            // Remove loading
            setIsLoading(false);
            // Set the record data
            setData(data);
            setRecord(!providers[provider].requiresRecord ? record.fields : record);
            //
          })();
        }

        return [...newItems];
      }
    });
  };

  const getDefaultItems = map(providers, ({ name }) => ({ name, desc: '' }));

  return (
    <div
      style={{
        marginBottom: '10px',
      }}
    >
      <PaneItem title={intl.formatMessage({ id: 'global.select-provider ' })}>
        <ButtonGroup>
          {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
          <Dropdown disabled={isLoading}>
            {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: any; }' is missing the following... Remove this comment to see the full error message */}
            <Control>{provider || intl.formatMessage({ id: 'dropdown.please-select' })}</Control>
            {getDefaultItems.map((item) => (
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              <Item
                key={item.name}
                title={item.name}
                onClick={() => handleProviderChange(item.name)}
              />
            ))}
          </Dropdown>
          {nodes.map((child, index) => (
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            <Dropdown disabled={isLoading} key={title + index}>
              {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: any; }' is missing the following... Remove this comment to see the full error message */}
              <Control>
                {child.value || intl.formatMessage({ id: 'dropdown.please-select' })}
              </Control>
              {child.values.map((item) => (
                // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                <Item
                  key={item.name}
                  title={item.name}
                  onClick={() => {
                    // Get the child data
                    const { url, suffix } = child.values.find((val) => val.name === item.name);
                    // Change the child
                    handleChildFieldChange(item.name, url, index, suffix);
                  }}
                />
              ))}
            </Dropdown>
          ))}
          {isLoading && <Spinner className="bp3-small" />}
          {record && (
            <Button
              intent={Intent.SUCCESS}
              icon="small-tick"
              onClick={() => {
                setFields(record);
              }}
            />
          )}
        </ButtonGroup>
      </PaneItem>
    </div>
  );
};

export default compose(
  withState('provider', 'setProvider', null),
  withState('nodes', 'setChildren', []),
  withState('isLoading', 'setIsLoading', false),
  withState('fields', 'setFields', null),
  injectIntl
)(DataProvider);
