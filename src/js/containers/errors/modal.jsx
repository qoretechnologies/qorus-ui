/* @flow */
/* eslint-disable camelcase */
import React from 'react';
import compose from 'recompose/compose';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Modal from '../../components/modal';
import { Controls, Control as Button } from '../../components/controls';
import Box from '../../components/box';

type Props = {
  data: Object,
  onClose: Function,
  onSave: Function,
  handleSubmit: Function,
  fields: Object,
  id: number,
};

const ErrorsModal: Function = ({
  data,
  onClose,
  handleSubmit,
  id,
  fields: {
    error,
    retry_delay_secs,
    business_flag,
    severity,
    description,
    status,
    forceworkflow,
  },
}: Props): React.Element<any> => (
  <form className="form-horizontal" onSubmit={handleSubmit}>
    <Modal hasFooter>
      <Modal.Header titleId="errors_modal" onClose={onClose}>
        {data.error || 'Add new error'}
      </Modal.Header>
      <Modal.Body>
        <Box top fill scrollY>
          <div className="form-group">
            <label
              htmlFor="errors_modal_type"
              className="col-sm-4 control-label"
            >
              Error Code
            </label>
            <div className="col-sm-6">
              <input
                id="errors_modal_type"
                type="text"
                required="required"
                className="form-control"
                {...error}
              />
            </div>
          </div>
          <div className="form-group">
            <label
              htmlFor="errors_modal_desc"
              className="col-sm-4 control-label"
            >
              Description
            </label>
            <div className="col-sm-6">
              <textarea
                id="erros_modal_desc"
                required="required"
                className="form-control"
                {...description}
              />
            </div>
          </div>
          <div className="form-group">
            <label
              htmlFor="errors_modal_severity"
              className="col-sm-4 control-label"
            >
              Severity
            </label>
            <div className="col-sm-6">
              <select
                id="errors_modal_severity"
                className="form-control"
                {...severity}
              >
                <option value="WARNING"> WARNING </option>
                <option value="MAJOR"> MAJOR </option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label
              htmlFor="errors_modal_status"
              className="col-sm-4 control-label"
            >
              Status
            </label>
            <div className="col-sm-6">
              <select
                id="errors_modal_status"
                className="form-control"
                {...status}
              >
                <option value="ERROR"> ERROR </option>
                <option value="RETRY"> RETRY </option>
                <option value="CANCELED"> CANCELED </option>
              </select>
            </div>
          </div>
          {status.value === 'RETRY' && (
            <div className="form-group">
              <label
                htmlFor="errors_modal_delay"
                className="col-sm-4 control-label"
              >
                Retry delay (secs)
              </label>
              <div className="col-sm-6">
                <input
                  id="erros_modal_delay"
                  type="text"
                  className="form-control"
                  {...retry_delay_secs}
                />
              </div>
            </div>
          )}
          <div className="form-group">
            <label
              htmlFor="errors_modal_bus"
              className="col-sm-4 control-label"
            >
              Business flag
            </label>
            <div className="col-sm-6">
              <input
                id="erros_modal_bus"
                type="checkbox"
                value={business_flag.checked || false}
                {...business_flag}
              />
            </div>
          </div>
          {id !== 'omit' && (
            <div className="form-group">
              <label
                htmlFor="errors_modal_force"
                className="col-sm-4 control-label"
              >
                Force Workflow
              </label>
              <div className="col-sm-6">
                <input
                  id="erros_modal_force"
                  type="checkbox"
                  value={forceworkflow.checked || false}
                  {...forceworkflow}
                />
              </div>
            </div>
          )}
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Controls noControls grouped>
          <Button
            label="Cancel"
            onClick={onClose}
            btnStyle="default"
            big
            type="button"
          />
          <Button label="Save" btnStyle="success" big type="submit" />
        </Controls>
      </Modal.Footer>
    </Modal>
  </form>
);

export default compose(
  connect(
    (state: Object, { data }): Object => ({
      initialValues: { ...data },
    })
  ),
  reduxForm({
    form: 'simpleForm',
    fields: [
      'error',
      'description',
      'severity',
      'status',
      'retry_delay_secs',
      'business_flag',
      'forceworkflow',
    ],
  })
)(ErrorsModal);
