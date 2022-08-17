import { setupPreviews } from '@previewjs/plugin-react/setup';
import { ReqorePanel, ReqoreTag, ReqoreTagGroup } from '@qoretechnologies/reqore';
import { capitalize, cloneDeep, isEqual, last, map, reduce } from 'lodash';
import size from 'lodash/size';
import React, { useState } from 'react';
import { useDebounce } from 'react-use';
import { ApiCallArgs } from '../Field/apiCallArgs';
import { RecordQueryArgs } from '../Field/searchArgs';
import Options, { fixOperatorValue, IOptions, TOption } from '../Field/systemOptions';
import { validateField } from '../Field/validations';
import Spacer from '../Spacer';
import Provider, { providers } from './provider';

export type TRecordType = 'search' | 'search-single' | 'create' | 'update' | 'delete';
export type TRealRecordType = 'read' | 'create' | 'update' | 'delete';

export interface IConnectorFieldProps {
  title?: string;
  onChange?: (name: string, data: IProviderType | string) => void;
  name: string;
  value: IProviderType | string;
  inline?: boolean;
  providerType?: 'inputs' | 'outputs' | 'event' | 'input-output' | 'condition';
  requiresRequest?: boolean;
  minimal?: boolean;
  isConfigItem?: boolean;
  recordType?: TRecordType;
  readOnly?: boolean;
  label?: string;
  isCollapsed?: boolean;
}

export type TProviderTypeSupports = {
  [key in `supports_${TRealRecordType}`]?: boolean;
};

export type TProviderTypeArgs = {
  [key in `${TRecordType}_args`]?: IOptions | IOptions[];
};

export interface IProviderType extends TProviderTypeArgs, TProviderTypeSupports {
  type: string;
  name: string;
  path?: string;
  options?: IOptions;
  hasApiContext?: boolean;
  optionsChanged?: boolean;
  desc?: string;
  use_args?: boolean;
  args?: any;
  supports_request?: boolean;
  is_api_call?: boolean;
  search_options?: IOptions;
  descriptions?: string[];
}

const supportsList = {
  create: true,
};

const supportsOperators = {
  search: true,
  'search-single': true,
};

const supportsArguments = {
  create: true,
  update: true,
};

const getRealRecordType = (recordType: TRecordType): TRealRecordType => {
  return recordType.startsWith('search') ? 'read' : (recordType as TRealRecordType);
};

const shouldShowSearchArguments = (
  recordType: TRecordType,
  optionProvider: IProviderType | null
): boolean => {
  const realRecordType = recordType.startsWith('search') ? 'read' : recordType;

  if (
    ['read', 'update', 'delete'].includes(realRecordType) &&
    optionProvider?.[`supports_${realRecordType}`]
  ) {
    return true;
  }

  return false;
};

export const getUrlFromProvider: (
  val: IProviderType | string,
  withOptions?: boolean,
  isRecord?: boolean
) => string = (val, withOptions, isRecord) => {
  // If the val is a string, return it
  if (typeof val === 'string') {
    return val;
  }
  const { type, name, path = '', options, is_api_call, hasApiContext } = val;
  let optionString;

  if (size(options)) {
    // Build the option string for URL
    optionString = `provider_yaml_options={${map(
      options,
      (value, key) => `${key}=${btoa(value?.value || value || '')}`
    ).join(',')}}`;
  }
  // Get the rules for the given provider
  const { url, suffix, recordSuffix, suffixRequiresOptions } = providers[type];

  if (withOptions) {
    return `${url}/${name}/${
      type === 'factory' ? 'provider_info/' : ''
    }constructor_options?context=ui${hasApiContext ? '&context=api' : ''}`;
  }

  // Check if the path ends in /request or /response
  const endsInSubtype = path.endsWith('/request') || path.endsWith('/response');

  // Build the suffix
  const realPath = `${suffix}${path}${
    endsInSubtype || is_api_call || isRecord ? '' : recordSuffix || ''
  }${withOptions ? '/constructor_options' : ''}`;

  const suffixString = suffixRequiresOptions
    ? optionString && optionString !== ''
      ? `${realPath}?${optionString}`
      : `${withOptions ? '/constructor_options' : `${realPath}`}`
    : realPath;

  // Build the URL based on the provider type
  return `${url}/${name}${suffixString}${type === 'type' && endsInSubtype ? '?action=type' : ''}`;
};

export const maybeBuildOptionProvider = (
  provider: IProviderType | string
): IProviderType | null => {
  if (!provider) {
    return null;
  }

  // If the provider is an object, return it
  if (typeof provider === 'object') {
    return provider;
  }
  // Check if the provider is a factory
  if (provider.startsWith('factory')) {
    // Get everything between the < and >
    //const factory = provider.substring(provider.indexOf('<') + 1, provider.indexOf('>'));
    // Get the factory name
    const [factoryType, nameWithOptions]: string[] = provider.split('/');
    // Get everything between the first / and { bracket
    const [factoryName] = nameWithOptions.split('{');
    // Get everything in the provider between first { and last }, which are the options
    const options = nameWithOptions.substring(
      nameWithOptions.indexOf('{') + 1,
      nameWithOptions.lastIndexOf('}')
    );
    // Split the options by comma
    const optionsArray = options.split(',');
    let optionsObject = {};
    if (size(optionsArray)) {
      // Map through all the options and split each by =, which is the key and value
      optionsObject = reduce(
        optionsArray,
        (newOptions, option) => {
          const [key, value] = option.split('=');
          return { ...newOptions, [key]: value };
        },
        {}
      );
    }
    // Return the new provider
    return {
      type: factoryType,
      name: factoryName,
      // Get everything after the last }/ from the provider
      path: provider.substring(provider.lastIndexOf('}/') + 2),
      options: optionsObject,
      // Add the optionsChanged key if the provider includes the "?options_changed" string
      optionsChanged: (provider as string).includes('?options_changed'),
    } as IProviderType;
  }
  // split the provider by /
  const [type, name, ...path] = provider.split('/');
  // Return it
  return {
    type,
    name,
    path: path.join('/'),
  } as IProviderType;
};

export const t = (str) => str;

const ConnectorField: React.FC<IConnectorFieldProps> = ({
  title,
  onChange,
  name,
  value,
  inline,
  providerType,
  minimal,
  isConfigItem,
  requiresRequest,
  recordType,
  readOnly,
  label,
  isCollapsed,
}) => {
  const [optionProvider, setOptionProvider] = useState<IProviderType | null>(
    maybeBuildOptionProvider(value)
  );
  const [nodes, setChildren] = useState(
    optionProvider
      ? [
          {
            value: optionProvider.name,
            values: [
              {
                name: optionProvider.name,
                url: providers[optionProvider.type].url,
                suffix: providers[optionProvider.type].suffix,
                desc: optionProvider.descriptions?.[0],
              },
            ],
          },
          ...(optionProvider.path
            ? optionProvider?.path
                .split('/')
                .filter((predicate) => predicate && predicate !== '')
                .map((item, index) => ({
                  value: item,
                  values: [{ name: item, desc: optionProvider.descriptions?.[index + 1] }],
                }))
            : []),
        ]
      : []
  );
  const [provider, setProvider] = useState(optionProvider?.type);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const clear = () => {
    setIsEditing(false);
    setOptionProvider(null);
  };

  const reset = () => {
    setChildren([]);
    setProvider(null);
    setOptionProvider(null);
    setIsLoading(false);
    onChange?.(name, undefined);
  };

  useDebounce(
    () => {
      if (!isEditing) {
        if (!optionProvider) {
          onChange?.(name, undefined);
          return;
        }

        const val = { ...optionProvider };

        if (val.type !== 'factory') {
          delete val.optionsChanged;
          delete val.options;
        }

        if (isConfigItem) {
          // Add type from optionProvider and get value from all nodes and join them by /
          const type = val.type;
          const newNodes = cloneDeep(nodes);

          if (type === 'factory') {
            let options = reduce(
              val.options,
              (newOptions, optionData, optionName) => {
                return `${newOptions}${optionName}=${optionData.value},`;
              },
              ''
            );
            // Remove the last comma from options
            options = options.substring(0, options.length - 1);

            if (newNodes[0]) {
              newNodes[0].value = `${newNodes[0].value}{${options}}`;
            }

            const value = newNodes.map((node) => node.value).join('/');

            onChange?.(name, `${type}/${value}${val.optionsChanged ? '?options_changed' : ''}`);
          } else {
            const value = nodes.map((node) => node.value).join('/');
            onChange?.(name, `${type}/${value}`);
          }
        } else {
          onChange?.(name, val);
        }
      }
    },
    30,
    [JSON.stringify(optionProvider), isEditing]
  );

  return (
    <div>
      <ReqorePanel
        collapsible
        padded
        label={label || 'Select data provider'}
        rounded
        isCollapsed={isCollapsed}
      >
        <Provider
          isConfigItem={isConfigItem}
          nodes={nodes}
          setChildren={setChildren}
          provider={provider}
          setProvider={setProvider}
          setOptionProvider={(data) => {
            setOptionProvider({
              ...data,
              use_args: true,
            });
          }}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          options={optionProvider?.options}
          optionsChanged={optionProvider?.optionsChanged}
          title={title}
          clear={clear}
          type={providerType}
          compact
          requiresRequest={requiresRequest}
          style={{
            display: inline ? 'inline-block' : 'block',
          }}
          onReset={reset}
          optionProvider={optionProvider}
          recordType={recordType}
          readOnly={readOnly}
        />
        {provider === 'factory' && optionProvider ? (
          <>
            <ReqorePanel collapsible label="Factory options" padded rounded>
              <Options
                onChange={(nm, val) => {
                  setOptionProvider((cur) => ({
                    ...cur,
                    options: val,
                    optionsChanged: !isEqual(optionProvider.options, val),
                  }));
                }}
                name="options"
                value={optionProvider.options}
                customUrl={`${getUrlFromProvider(optionProvider, true)}`}
                readOnly={readOnly}
              />
            </ReqorePanel>
            <Spacer size={15} />
          </>
        ) : null}
        {/* This means that we are working with an API Call provider */}
        {requiresRequest && optionProvider?.supports_request ? (
          <>
            <ReqorePanel label="Allow API arguments" unMountContentOnCollapse rounded padded>
              <ApiCallArgs
                value={optionProvider?.args?.value}
                url={`${getUrlFromProvider(optionProvider)}`}
                onChange={(_nm, value, type) => {
                  setOptionProvider((cur) => ({
                    ...cur,
                    args: {
                      type,
                      value,
                    },
                  }));
                }}
                readOnly={readOnly}
              />
            </ReqorePanel>
          </>
        ) : null}
        {/* This means that we are working with a record update */}
        {recordType && optionProvider && supportsArguments[recordType] ? (
          <ReqorePanel collapsible label={`${capitalize(recordType)} options`} padded rounded>
            <RecordQueryArgs
              readOnly={readOnly}
              type={recordType}
              asList={supportsList[recordType]}
              url={getUrlFromProvider(optionProvider, false, true)}
              value={optionProvider?.[`${recordType}_args`]}
              onChange={(_nm, val) => {
                setOptionProvider((cur: IProviderType | null) => {
                  const result: IProviderType = {
                    ...cur,
                    [`${recordType}_args`]: val,
                  } as IProviderType;

                  return result;
                });
              }}
              hasOperators={supportsOperators[recordType] || false}
            />
          </ReqorePanel>
        ) : null}
        {/* This means that we are working with a record search */}
        {recordType && optionProvider && shouldShowSearchArguments(recordType, optionProvider) ? (
          <>
            <Spacer size={15} />
            <ReqorePanel collapsible label="Search arguments" padded rounded>
              <RecordQueryArgs
                type="search"
                readOnly={readOnly}
                hasOperators
                url={getUrlFromProvider(optionProvider, false, true)}
                value={optionProvider?.search_args as IOptions}
                onChange={(nm, val) => {
                  setOptionProvider((cur: IProviderType | null) => {
                    const result: IProviderType = {
                      ...cur,
                      search_args: val,
                    } as IProviderType;

                    return result;
                  });
                }}
              />
            </ReqorePanel>
            <Spacer size={15} />
            <ReqorePanel
              collapsible
              label="Search options"
              padded
              rounded
              unMountContentOnCollapse={false}
            >
              <Options
                onChange={(nm, val) => {
                  setOptionProvider((cur: IProviderType | null) => {
                    const result: IProviderType = {
                      ...cur,
                      search_options: val,
                    } as IProviderType;

                    return result;
                  });
                }}
                readOnly={readOnly}
                name="search_options"
                value={optionProvider.search_options}
                customUrl={`${getUrlFromProvider(optionProvider, false, true)}/search_options`}
              />
            </ReqorePanel>
            <Spacer size={15} />
          </>
        ) : null}
        {recordType && validateField(recordType, optionProvider) ? (
          <ReqorePanel padded flat rounded customTheme={{ main: '#f7f7f7' }}>
            <ReqoreTagGroup size="small">
              <>
                {recordType === 'delete' && (
                  <>
                    <ReqoreTag label="DELETE FROM" />
                    <ReqoreTag label={last(optionProvider.path.split('/'))} color="#f1ca00" />
                  </>
                )}
                {optionProvider?.create_args && (
                  <>
                    <ReqoreTag label="INSERT INTO" />
                    <ReqoreTag label={last(optionProvider.path.split('/'))} color="#f1ca00" />
                    {(optionProvider.create_args as IOptions[]).map((createArgs) => (
                      <>
                        {map<IOptions>(
                          createArgs as any,
                          (option: TOption, optionName: string) => ({
                            option,
                            optionName,
                          })
                        ).map(({ optionName }: any, index) => (
                          <>
                            <ReqoreTag label={optionName} intent="info" />
                          </>
                        ))}
                        <ReqoreTag label="VALUES" />
                        {map<IOptions>(
                          createArgs as any,
                          (option: TOption, optionName: string) => ({
                            option,
                            optionName,
                          })
                        ).map(({ option }: any, index) => (
                          <>
                            {option.value ? (
                              <ReqoreTag label={option.value?.toString()} intent="success" />
                            ) : null}
                          </>
                        ))}
                      </>
                    ))}
                  </>
                )}
                {optionProvider?.update_args && (
                  <>
                    <ReqoreTag label="UPDATE" />
                    <ReqoreTag label={last(optionProvider.path.split('/'))} color="#f1ca00" />
                    <ReqoreTag label="SET" />
                    {map<IOptions>(
                      optionProvider.update_args as IOptions,
                      (option: TOption, optionName: string) => (
                        <>
                          <ReqoreTag label={optionName} intent="info" />
                          <ReqoreTag label="=" />
                          {option.value ? (
                            <ReqoreTag label={option.value?.toString()} intent="success" />
                          ) : null}
                        </>
                      )
                    )}
                  </>
                )}
                {optionProvider?.search_args && (
                  <>
                    <ReqoreTag label="WHERE" />
                    {map<IOptions>(
                      optionProvider.search_args as IOptions,
                      (option: TOption, optionName: string) => ({
                        option,
                        optionName,
                      })
                    ).map(({ option, optionName }, index) => (
                      <>
                        {size(optionProvider.search_args) > 1 && index !== 0 ? (
                          <ReqoreTag label="AND" />
                        ) : null}
                        <ReqoreTag label={optionName} intent="info" />
                        {fixOperatorValue(option.op).map((op) => (
                          <ReqoreTag label={op} key={op} color="#ff47a3" />
                        ))}
                        {option.value ? (
                          <ReqoreTag label={option.value?.toString()} intent="success" />
                        ) : null}
                      </>
                    ))}
                  </>
                )}
              </>
            </ReqoreTagGroup>
          </ReqorePanel>
        ) : null}
      </ReqorePanel>
    </div>
  );
};

const PreviewProvider = (props: IConnectorFieldProps) => {
  const [value, setValue] = useState<IProviderType>({
    type: 'datasource',
    name: 'omquser',
    supports_read: true,
    supports_update: true,
    supports_create: true,
    supports_delete: true,
    descriptions: ['omquser description', 'bb_local description'],
    path: '/bb_local',
    use_args: true,
    search_options: {
      requires_result: {
        type: 'bool',
        value: null,
      },
    },
  });

  return (
    <ConnectorField
      {...props}
      value={{
        ...value,
        ...((props?.value as IProviderType) || {}),
      }}
      onChange={(_name, val) => setValue(val as any)}
    />
  );
};

setupPreviews(PreviewProvider, {
  'API Call': {
    name: 'ApiCall',
    value: undefined,
    requiresRequest: true,
  },
  ReadOnly: {
    name: 'Search',
    readOnly: true,
    value: {
      search_args: {
        remote_id: {
          type: 'string',
          op: ['='],
          value: '123',
        },
      },
    } as any,
    recordType: 'search',
  },
  Search: {
    name: 'Search',
    value: {
      search_args: {
        remote_id: {
          type: 'string',
          op: ['='],
          value: '123',
        },
      },
    } as any,
    recordType: 'search',
  },
  Update: {
    name: 'Update',
    value: undefined,
    recordType: 'update',
  },
  Create: {
    name: 'Create',
    value: undefined,
    recordType: 'create',
  },
  Delete: {
    name: 'Delete',
    value: undefined,
    recordType: 'delete',
  },
});

export default ConnectorField;
