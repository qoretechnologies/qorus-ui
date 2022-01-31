/* @flow */
import { ReqoreCheckbox } from '@qoretechnologies/reqore';
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

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
  <ReqoreCheckbox checked={checked === 'CHECKED'} onChange={handleClick} />
);

export default compose(
  withHandlers({
    handleClick:
      ({ action, setChecked }: Props): Function =>
      (event: Object): void => {
        event.persist();

        if (action) action(event);
      },
  }),
  pure(['checked'])
)(CheckboxElement);
