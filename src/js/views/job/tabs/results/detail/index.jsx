/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import ResultData from './data';
import actions from '../../../../../store/api/actions';
import { Control } from '../../../../../components/controls';
import Resize from '../../../../../components/resize/handle';
import patch from '../../../../../hocomponents/patchFuncArgs';

const ResultDetail = ({
  result,
  handleCloseClick,
}: {
  result: Object,
  handleCloseClick: Function,
}) => (
  <div className="job-result-info">
    <Resize top />
    <div className="inner">
      <div className="pull-right">
        <Control
          iconName="cross"
          className="pt-minimal"
          onClick={handleCloseClick}
        />
      </div>
      {result && <ResultData result={result} />}
    </div>
  </div>
);

const jobResultSelector = (state, props) => {
  const {
    location: {
      query: { job },
    },
  } = props;
  const jobInstanceId = parseInt(job, 10);
  const result = state.api.jobresults.data.find(
    item => item.job_instanceid === jobInstanceId
  );
  return { result };
};

const prepareRequestParams = mapProps((props: Object) => ({
  ...props,
  queryParams: {},
  instanceId: props.location.query.job,
}));

const loadOnMount = lifecycle({
  // TODO: use sync with force in future
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
  withHandlers({
    handleCloseClick: ({ changeJobQuery }: Object) => (): void => {
      changeJobQuery('');
    },
  })
)(ResultDetail);
