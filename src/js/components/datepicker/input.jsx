import React, { PropTypes } from 'react';
import { Control } from '../controls';

export default function Input(props) {
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
          value={props.inputDate}
          onChange={props.onInputChange}
          onClick={props.onInputClick}
        />
      </div>
      <Control
        type="submit"
        css={{ display: 'none' }}
      />
    </form>
  );
}

Input.propTypes = {
  onFormSubmit: PropTypes.func,
  inputDate: PropTypes.string,
  onInputChange: PropTypes.func,
  onInputClick: PropTypes.func,
};
