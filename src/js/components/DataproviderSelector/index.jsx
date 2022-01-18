import { Button, Tag } from '@blueprintjs/core';
import size from 'lodash/size';
import React, { useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import styled from 'styled-components';
import SubField from '../../components/Field/subfield';
import Provider, { providers } from './provider';

export interface IConnectorFieldProps {
  title?: string;
  onChange: (name: string, data: any) => void;
  name: string;
  value: any;
  isInitialEditing?: boolean;
  inline?: boolean;
  providerType?: 'inputs' | 'outputs' | 'event' | 'input-output' | 'condition';
  t: TTranslator;
}

const StyledProviderUrl = styled.div`
  min-height: 40px;
  line-height: 40px;

  span {
    font-weight: 500;
  }
`;

/* The getUrlFromProvider function takes a provider object and returns the URL for that provider. */
export const getUrlFromProvider = (val) => {
  const { type, name, path } = val;
  // Get the rules for the given provider
  const { url, suffix, recordSuffix, requiresRecord } = providers[type];
  // Build the URL based on the provider type
  return `${url}/${name}${suffix}${path}${requiresRecord ? recordSuffix : ''}`;
};

const ConnectorField: React.FC<IConnectorFieldProps> = ({
  title,
  onChange,
  name,
  value,
  isInitialEditing,
  inline,
  providerType,
}) => {
  const [nodes, setChildren] = useState([]);
  const [provider, setProvider] = useState(null);
  const [optionProvider, setOptionProvider] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isInitialEditing);

  const clear = () => {
    setIsEditing(false);
    setOptionProvider(null);
  };

  const reset = () => {
    setChildren([]);
    setProvider(null);
    setOptionProvider(null);
    setIsLoading(false);
  };

  // Update the editing state when initial editing changes
  useEffect(() => {
    setIsEditing(isInitialEditing);
  }, [isInitialEditing]);

  useUpdateEffect(() => {
    if (value) {
      setOptionProvider(value);
    }
  }, [JSON.stringify(value)]);

  useUpdateEffect(() => {
    if (!optionProvider) {
      onChange?.(name, optionProvider);
      return;
    }

    const val = { ...optionProvider };

    if (!size(val?.options)) {
      delete val.options;
    }

    onChange?.(name, val);
  }, [JSON.stringify(optionProvider), isEditing]);

  if (isEditing && value) {
    return (
      <>
        <SubField title={'Current Provider'}>
          <StyledProviderUrl>
            {title && <span>{title}:</span>}{' '}
            <Tag minimal large onRemove={clear}>
              {getUrlFromProvider(value)}{' '}
            </Tag>
          </StyledProviderUrl>
        </SubField>
      </>
    );
  }

  console.log(nodes, provider);

  return (
    <>
      <SubField title={'Select'}>
        <Provider
          nodes={nodes}
          setChildren={setChildren}
          provider={provider}
          setProvider={setProvider}
          setOptionProvider={setOptionProvider}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
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
        <Button intent="danger" icon="cross" onClick={reset} />
      ) : null}
    </>
  );
};

export default ConnectorField;
