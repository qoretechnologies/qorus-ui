/* @flow */
import React, { PropTypes } from 'react';
import { Control } from '../controls';

type Props = {
  placeholder?: string,
  onFormSubmit: (event: Object) => void,
  submitOnBlur?: boolean,
  inputDate: string,
  onInputChange: (event: Object) => void,
  onInputClick: (event: Object) => void,
  id?: string,
}

export default function Input(props: Props) {
  return (
    <form
      onSubmit={props.onFormSubmit}
      className="datepicker-group"
      id="datepicker-form"
    >
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
          onBlur={props.submitOnBlur ? props.onFormSubmit : null}
          value={props.inputDate}
          onChange={props.onInputChange}
          onClick={props.onInputClick}
          placeholder={props.placeholder}
          id={props.id}
        />
      </div>
      <Control
        type="submit"
        css={{ display: 'none' }}
      />
    </form>
  );
}
