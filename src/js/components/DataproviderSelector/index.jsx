import { Button, Classes, Tag } from '@blueprintjs/core';
import { cloneDeep, isEqual, map, reduce } from 'lodash';
import size from 'lodash/size';
import React, { useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import SubField from '../../components/Field/subfield';
import Options from '../Field/systemOptions';
import Provider, { providers } from './provider';

const StyledProviderUrl = styled.div`
  min-height: 40px;
  line-height: 40px;

  span {
    font-weight: 500;
  }
`;

/* The getUrlFromProvider function takes a provider object and returns the URL for that provider. */
export const getUrlFromProvider = (val, withOptions) => {
  // If the val is a string, return it
  if (typeof val === 'string') {
    return val;
  }
  const { type, name, path, options } = val;
  let optionString;

  if (size(options)) {
    // Build the option string for URL
    optionString = `provider_options={${map(
      options,
      (value, key) => `${key}=${btoa(value?.value || value || '')}`
    ).join(',')}}`;
  }
  // Get the rules for the given provider
  const { url, suffix, recordSuffix, requiresRecord, suffixRequiresOptions } = providers[type];

  if (withOptions) {
    return `${url}/${name}/${
      type === 'factory' ? 'provider_info/' : ''
    }constructor_options?context=ui`;
  }

  // Check if the path ends in /request or /response
  const endsInSubtype = path.endsWith('/request') || path.endsWith('/response');

  // Build the suffix
  const realPath = `${suffix}${path}${endsInSubtype ? '' : recordSuffix || ''}${
    withOptions ? '/constructor_options' : ''
  }`;

  const suffixString = suffixRequiresOptions
    ? optionString && optionString !== ''
      ? `${realPath}?${optionString}`
      : `${withOptions ? '/constructor_options' : `${realPath}`}`
    : realPath;

  // Build the URL based on the provider type
  return `${url}/${name}${suffixString}${type === 'type' && endsInSubtype ? '?action=type' : ''}`;
};

export const maybeBuildOptionProvider = (provider) => {
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
    const [factoryType, nameWithOptions] = provider.split('/');
    // Get everything between the first / and { bracket
    const [factoryName] = nameWithOptions.split('{');
    // Get everything in the provider between { and }, which are the options
    let options = provider.substring(provider.indexOf('{') + 1, provider.indexOf('}'));
    console.log({ provider, factoryType, nameWithOptions, factoryName, options });
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
      path: provider.substring(provider.lastIndexOf('}/') + 2),
      options: optionsObject,
      // Add the optionsChanged key if the provider includes the "?options_changed" string
      optionsChanged: provider.includes('?options_changed'),
    };
  }

  // split the provider by /
  const [type, name, ...path] = provider.split('/');
  // Return it
  return {
    type,
    name,
    path: path.join('/'),
  };
};

const ConnectorField = ({
  title,
  onChange,
  name,
  value,
  isInitialEditing,
  inline,
  providerType,
  minimal,
  isConfigItem,
}) => {
  const [optionProvider, setOptionProvider] = useState(maybeBuildOptionProvider(value));
  const [nodes, setChildren] = useState(
    optionProvider && optionProvider.type === 'factory'
      ? [
          {
            value: optionProvider.name,
            values: [
              {
                name: optionProvider.name,
                url: providers[optionProvider.type].url,
                suffix: providers[optionProvider.type].suffix,
              },
            ],
          },
          ...(optionProvider.path
            ? optionProvider?.path
                .replace('/', '')
                .split('/')
                .map((item) => ({ value: item, values: [{ name: item }] }))
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
    onChange(name, null);
  };

  // Update the editing state when initial editing changes
  useEffect(() => {
    if (optionProvider?.type !== 'factory') {
      setIsEditing(isInitialEditing);
    }
  }, [isInitialEditing]);

  useUpdateEffect(() => {
    if (value && typeof value === 'object') {
      setOptionProvider(value);
    }
  }, [JSON.stringify(value)]);

  useUpdateEffect(() => {
    if (!isEditing) {
      if (!optionProvider) {
        onChange?.(name, optionProvider);
        return;
      }

      const val = { ...optionProvider };

      if (!size(val?.options)) {
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

          console.log(newNodes);

          if (newNodes[0]) {
            newNodes[0].value = `${newNodes[0].value}{${options}}`;
          }

          const value = newNodes.map((node) => node.value).join('/');

          console.log(value);

          onChange(name, `${type}/${value}${val.optionsChanged ? `?options_changed` : ''}`);
        } else {
          const value = nodes.map((node) => node.value).join('/');
          onChange(name, `${type}/${value}`);
        }
      } else {
        onChange?.(name, val);
      }
    }
  }, [JSON.stringify(optionProvider), isEditing]);

  if (isEditing && value && optionProvider?.type !== 'factory') {
    return (
      <div style={{ overflow: 'hidden' }}>
        <SubField title={!minimal && 'Current Provider'}>
          <StyledProviderUrl>
            {title && <span>{title}:</span>}{' '}
            <Tag minimal large onRemove={clear}>
              {getUrlFromProvider(value)}{' '}
            </Tag>
          </StyledProviderUrl>
        </SubField>
      </div>
    );
  }

  console.log(nodes, provider, optionProvider);

  return (
    <div style={{ overflow: 'hidden' }}>
      <SubField title={'Select'}>
        <Provider
          isConfigItem={isConfigItem}
          nodes={nodes}
          setChildren={setChildren}
          provider={provider}
          setProvider={setProvider}
          setOptionProvider={setOptionProvider}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          options={optionProvider?.options}
          optionsChanged={optionProvider?.optionsChanged}
          title={title}
          clear={clear}
          type={providerType}
          compact
          style={{
            display: inline ? 'inline-block' : 'block',
          }}
        />
      </SubField>
      {size(nodes) ? (
        <Button intent="danger" icon="cross" onClick={reset} className={Classes.FIXED} />
      ) : null}
      {provider === 'factory' && optionProvider ? (
        <SubField title={'Factory Options'}>
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
          />
        </SubField>
      ) : null}
    </div>
  );
};

export default ConnectorField;
