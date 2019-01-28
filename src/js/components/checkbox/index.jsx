/* @flow */
import React from 'react';
import classNames from 'classnames';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import lifecycle from 'recompose/lifecycle';
import { Icon, Checkbox } from '@blueprintjs/core';

import { CHECKBOX_CLASSES } from '../../constants/checkbox';

type Props = {
  checked: string,
  checkedState: string,
  action: Function,
  handleClick: Function,
  setChecked: Function,
  className: string,
};

const CheckboxElement: Function = ({
  className,
  handleClick,
  checkedState,
}: Props): React.Element<any> => (
  <Checkbox
    indeterminate={checkedState === 'HALFCHECKED'}
    checked={checkedState === 'CHECKED'}
    onChange={handleClick}
    className="checkbox-wrapper"
  />
);

export default compose(
  withState(
    'checkedState',
    'setChecked',
    ({ checked }: Props): string => checked
  ),
  mapProps(
    ({ checkedState, ...rest }: Props): Props => ({
      className: classNames(CHECKBOX_CLASSES[checkedState]),
      checkedState,
      ...rest,
    })
  ),
  withHandlers({
    handleClick: ({ action, setChecked }: Props): Function => (
      event: Object
    ): void => {
      event.persist();
      event.preventDefault();
      event.stopPropagation();

      setChecked((checked: string) =>
        checked === 'CHECKED' ? 'UNCHECKED' : 'CHECKED'
      );

      if (action) action(event);
    },
  }),
  lifecycle({
    componentWillReceiveProps (nextProps) {
      if (this.props.checked !== nextProps.checked) {
        this.props.setChecked(() => nextProps.checked);
      }
    },
  }),
  pure(['checked', 'checkedState'])
)(CheckboxElement);
