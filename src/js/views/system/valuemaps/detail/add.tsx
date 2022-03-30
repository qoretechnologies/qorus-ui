/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';

// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
  <form className="form-inline new-value" onSubmit={onFormSubmit}>
    <ControlGroup>
      <InputGroup
        type="text"
        placeholder="Key"
        value={keyValue}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onChange={onKeyChange}
        name="value-key"
      />
      <InputGroup
        type="text"
        placeholder="Value"
        value={value}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
        onChange={onValueChange}
        name="value-value"
      />
      <ButtonGroup>
        <Button
          title={enabled ? 'Enabled' : 'Disabled'}
          icon="power"
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
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
    onKeyChange: (event: EventHandler) => keyUpdater(event.target.value),
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
    onValueChange: (event: EventHandler) => valueUpdater(event.target.value),
    onEnabledClick: () => enabledUpdater(enabled => !enabled),
    ...rest,
  })),
  withHandlers({
    onFormSubmit: ({ keyValue, value, add, enabled }): Function => (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
      event: EventHandler
    ): void => {
      event.preventDefault();

      if (keyValue !== '' && value !== '') {
        add(keyValue, value, enabled);
      }
    },
  })
)(AddValue);
