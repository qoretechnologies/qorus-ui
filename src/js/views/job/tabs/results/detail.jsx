/* @flow */
import React from 'react';

import { Control } from '../../../../components/controls';
import Resize from '../../../../components/resize/handle';
import allowBackToResultList from '../../../../hocomponents/jobs/allow-back-to-result-list';

const ResultDetail = ({
  result,
  backToResultList,
}: {
  result: Object,
  backToResultList: Function,
}) => (
  <div className="job-result-info">
    <Resize top>
      <i className="fa fa-bars" />
    </Resize>
    <div className="inner">
      <div className="pull-right">
        <Control
          btnStyle="inverse"
          icon="close"
          onClick={backToResultList}
          label="close"
          className="close-result-item"
        />
      </div>
    </div>
  </div>
);

export default allowBackToResultList(ResultDetail);
