/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { Checkbox } from '@blueprintjs/core';

type Props = {
  checked: string,
  checkedState: string,
  action: Function,
  handleClick: Function,
  setChecked: Function,
  className: string,
  intent: string,
};

const CheckboxElement: Function = ({
  className,
  handleClick,
  checked,
  intent,
}: Props): React.Element<any> => (
  <Checkbox
    indeterminate={checked === 'HALFCHECKED'}
    checked={checked === 'CHECKED'}
    onChange={handleClick}
    className="checkbox-wrapper"
    intent={intent}
  />
);

export default compose(
  withHandlers({
    handleClick: ({ action, setChecked }: Props): Function => (
      event: Object
    ): void => {
      event.persist();

      if (action) action(event);
    },
  }),
  pure(['checked'])
)(CheckboxElement);
