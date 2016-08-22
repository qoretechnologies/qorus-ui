/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import lifecycle from 'recompose/lifecycle';
import { connect } from 'react-redux';

import ResultData from './data';
import actions from '../../../../../store/api/actions';
import { Control } from '../../../../../components/controls';
import Resize from '../../../../../components/resize/handle';
import allowBackToResultList from '../../../../../hocomponents/jobs/allow-back-to-result-list';
import patch from '../../../../../hocomponents/patchFuncArgs';

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
      {result && <ResultData result={result} />}
    </div>
  </div>
);

const jobResultSelector = (state, props) => {
  const { params: { instanceId } } = props;
  const jobInstanceId = parseInt(instanceId, 10);
  const result = state.api.jobresults.data.find(item => item.job_instanceid === jobInstanceId);
  return { result };
};

const prepareRequestParams = mapProps((props: Object) => ({
  ...props,
  queryParams: {},
  instanceId: props.params.instanceId,
}));

const loadOnMount = lifecycle({ // TODO: use sync with force in future
  componentDidMount() {
    this.props.load();
  },
});

const loadOnInstanceIdChanged = lifecycle({
  componentDidUpdate(prevProps) {
    const { instanceId: prevInstanceId } = prevProps;
    const { instanceId, load } = this.props;
    if (prevInstanceId !== instanceId) {
      load();
    }
  },
});

export default compose(
  connect(
    jobResultSelector,
    {
      load: actions.jobresults.fetch,
    }
  ),
  prepareRequestParams,
  patch('load', ['queryParams', 'instanceId']),
  loadOnMount,
  loadOnInstanceIdChanged,
  allowBackToResultList
)(ResultDetail);
