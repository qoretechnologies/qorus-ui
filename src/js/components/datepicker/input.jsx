/* @flow */
import React from 'react';
import mapProps from 'recompose/mapProps';

type Props = {
  placeholder?: string,
  applyOnBlur?: boolean,
  inputDate: string,
  onApplyDate: () => void,
  onInputChange: (event: Object) => void,
  onKeyUp: (event: Object) => void,
  onInputClick: (event: Object) => void,
  id?: string,
}

const Input = (props: Props) => (
  <div className="datepicker-group">
    <div className="input-group">
        <span
          className="input-group-addon"
          onClick={props.onInputClick}
        >
          <i className="fa fa-calendar" />
        </span>
      <input
        type="text"
        className="form-control"
        onBlur={props.applyOnBlur? props.onApplyDate: null}
        value={props.inputDate}
        onChange={props.onInputChange}
        onKeyUp={props.onKeyUp}
        onClick={props.onInputClick}
        placeholder={props.placeholder}
        id={props.id}
      />
    </div>
  </div>
);

type KeyUpHandlerProps = {
  other: Object;
  onApplyDate: Function
}

const addKeyUpHandler = mapProps(
  ({ onApplyDate, ...other }: KeyUpHandlerProps) => ({
    ...other,
    onApplyDate,
    onKeyUp: (e: Object) => {
      if (e.keyCode === 13) {
        onApplyDate();
      }
    },
  })
);

export default addKeyUpHandler(Input);
