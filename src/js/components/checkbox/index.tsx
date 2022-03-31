/* @flow */
import { Checkbox } from '@blueprintjs/core';
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

type Props = {
  checked: string;
  checkedState: string;
  action: Function;
  handleClick: Function;
  setChecked: Function;
  className: string;
  intent: string;
};

const CheckboxElement: Function = ({
  className,
  handleClick,
  checked,
  intent,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <Checkbox
    indeterminate={checked === 'HALFCHECKED'}
    checked={checked === 'CHECKED'}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
    onChange={handleClick}
    className="checkbox-wrapper bp3-align-right"
    intent={intent}
  />
);

export default compose(
  withHandlers({
    handleClick:
      ({ action, setChecked }: Props): Function =>
      (event: Object): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
        event.persist();

        if (action) action(event);
      },
  }),
  pure(['checked'])
)(CheckboxElement);
