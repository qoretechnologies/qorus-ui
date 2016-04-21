import React, { PropTypes } from 'react';

export default function Input(props) {
  return (
    <form onSubmit={props.onFormSubmit} className="datepicker-group">
      <div className="input-group">
        <span className="input-group-addon">
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
    </form>
  );
}

Input.propTypes = {
  onFormSubmit: PropTypes.func,
  inputDate: PropTypes.string,
  onInputChange: PropTypes.func,
  onInputClick: PropTypes.func,
};
