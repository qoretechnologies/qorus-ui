/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import { notifications } from '../../store/ui/actions';
import { Control } from '../../components/controls';


const ButtonsBar = (
  { success, warning, error }: { success: Function, warning: Function, error: Function }
) => (
  <div className="btn-group">
    <Control
      btnStyle="success"
      onClick={() => success('test')}
      label="success"
    />
    <Control
      btnStyle="warning"
      onClick={() => warning('test')}
      label="warning"
    />
    <Control
      btnStyle="error"
      onClick={() => error('test')}
      label="error"
    />
  </div>
);

export default connect(
  () => ({}),
  notifications
)(ButtonsBar);
