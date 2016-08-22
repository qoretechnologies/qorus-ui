/* @flow */
import React from 'react';
import { Control } from '../../../../components/controls';
import Resize from '../../../../components/resize/handle';

export default ({ result, clear }: { result: Object, clear: Function }) => (
  <div className="job-result-info">
    <Resize top>
      <i className="fa fa-bars" />
    </Resize>
    <div className="inner">
      <div className="pull-right">
        <Control
          btnStyle="inverse"
          icon="close"
          onClick={clear}
          label="close"
          className="close-result-item"
        />
      </div>
    </div>
  </div>
);
