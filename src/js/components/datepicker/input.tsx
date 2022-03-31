/* @flow */
import { InputGroup } from '@blueprintjs/core';
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

type Props = {
  placeholder?: string;
  applyOnBlur?: boolean;
  inputDate: string;
  onApplyDate: () => void;
  onInputChange: (event: any) => void;
  onKeyUp: (event: any) => void;
  onInputClick: (event: any) => void;
  id?: string;
  name?: string;
  className?: string;
  disabled: boolean;
};

const Input = (props: Props) => (
  <InputGroup
    type="text"
    onBlur={props.applyOnBlur ? props.onApplyDate : null}
    value={props.inputDate}
    onChange={props.onInputChange}
    onKeyUp={props.onKeyUp}
    onClick={props.onInputClick}
    placeholder={props.placeholder}
    id={props.id}
    name={props.name}
    className={props.className}
    disabled={props.disabled}
  />
);

const addKeyUpHandler = withHandlers({
  onKeyUp:
    ({ onApplyDate }: { onApplyDate: Function }): Function =>
    (e: any) => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'keyCode' does not exist on type 'Object'... Remove this comment to see the full error message
      if (e.keyCode === 13) {
        onApplyDate();
      }
    },
});

export default compose(addKeyUpHandler, pure(['inputDate', 'disabled']))(Input);
