import { Callout } from '@blueprintjs/core';
import React from 'react';
import { useAsyncRetry } from 'react-use';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import SelectField from './select';

export const interfaceToPlural = {
  service: 'services',
  step: 'steps',
  'mapper-code': 'mapper-codes',
  errors: 'errors',
  workflow: 'workflows',
  job: 'jobs',
  mapper: 'mappers',
  group: 'groups',
  event: 'events',
  queue: 'queues',
  connection: 'connections',
  fsm: 'fsms',
  pipeline: 'pipelines',
  'value-map': 'valuemaps',
  type: 'types',
  class: 'classes',
};

export const InterfaceSelector = ({ name, onChange, value, default_value, type }) => {
  // Get the qorus instance
  // Fetch data on mount
  const {
    value: interfaces,
    loading,
    retry,
    error,
  } = useAsyncRetry(async () => {
    // Fetch the interfaces based on the type
    return get(`${settings.REST_BASE_URL}/${interfaceToPlural[type]}?list=true`);
  }, [type]);

  if (error) {
    return (
      <Callout intent="danger">
        <p style={{ fontWeight: 500 }}>{'Error Loading Interfaces'}</p>
        {error}
      </Callout>
    );
  }

  // If interfaces are not loaded yet, return a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    // @ts-expect-error ts-migrate(2740) FIXME: Type '{ defaultItems: any; value: any; name: any; ... Remove this comment to see the full error message
    <SelectField
      defaultItems={interfaces.map((i) => ({ name: i }))}
      value={value || default_value}
      name={name}
      onChange={onChange}
    />
  );
};
