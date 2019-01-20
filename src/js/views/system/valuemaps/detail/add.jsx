/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';

import { Control as Button } from '../../../../components/controls';
import { ButtonGroup, ControlGroup, InputGroup } from '@blueprintjs/core';

type Props = {
  keyValue: string,
  value: string,
  onKeyChange: Function,
  onValueChange: Function,
  onEnabledClick: Function,
  onFormSubmit: Function,
  enabled: boolean,
};

const AddValue: Function = ({
  keyValue,
  value,
  onKeyChange,
  onValueChange,
  onEnabledClick,
  enabled,
  onFormSubmit,
}: Props): React.Element<any> => (
  <form className="form-inline new-value" onSubmit={onFormSubmit}>
    <ControlGroup>
      <InputGroup
        type="text"
        placeholder="Key"
        value={keyValue}
        onChange={onKeyChange}
        name="value-key"
      />
      <InputGroup
        type="text"
        placeholder="Value"
        value={value}
        onChange={onValueChange}
        name="value-value"
      />
      <ButtonGroup>
        <Button
          title={enabled ? 'Enabled' : 'Disabled'}
          iconName="power"
          big
          btnStyle={enabled ? 'success' : 'danger'}
          type="button"
          onClick={onEnabledClick}
        />
        <Button label="Save" big btnStyle="success" type="submit" />
      </ButtonGroup>
    </ControlGroup>
  </form>
);

export default compose(
  withState('keyValue', 'keyUpdater', ''),
  withState('value', 'valueUpdater', ''),
  withState('enabled', 'enabledUpdater', true),
  mapProps(({ keyUpdater, valueUpdater, enabledUpdater, ...rest }) => ({
    onKeyChange: (event: EventHandler) => keyUpdater(event.target.value),
    onValueChange: (event: EventHandler) => valueUpdater(event.target.value),
    onEnabledClick: () => enabledUpdater(enabled => !enabled),
    ...rest,
  })),
  withHandlers({
    onFormSubmit: ({ keyValue, value, add, enabled }): Function => (
      event: EventHandler
    ): void => {
      event.preventDefault();

      if (keyValue !== '' && value !== '') {
        add(keyValue, value, enabled);
      }
    },
  })
)(AddValue);
