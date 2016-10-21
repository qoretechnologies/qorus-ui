/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';

import { Control as Button } from '../../../../components/controls';

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
  <form
    className="form-inline new-value"
    onSubmit={onFormSubmit}
  >
    <div className="input-group multiple-input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Key"
        value={keyValue}
        onChange={onKeyChange}
        name="value-key"
      />
      <input
        type="text"
        className="form-control"
        placeholder="Value"
        value={value}
        onChange={onValueChange}
        name="value-value"
      />
      <div className="input-group-btn">
        <Button
          icon="power-off"
          big
          btnStyle={enabled ? 'success' : 'default'}
          type="button"
          onClick={onEnabledClick}
        />
        <Button
          label="Save"
          big
          btnStyle="success"
          type="submit"
        />
      </div>
    </div>
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
  withHandlers(({
    onFormSubmit: ({ keyValue, value, add, enabled }): Function => (event: EventHandler): void => {
      event.preventDefault();

      if (keyValue !== '' && value !== '') {
        add(keyValue, value, enabled);
      }
    },
  }))
)(AddValue);
