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
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Headbar from '../../../../../components/Headbar';
import Pull from '../../../../../components/Pull';
import Box from '../../../../../components/box';
import { Breadcrumbs, Crumb } from '../../../../../components/breadcrumbs';
import Loader from '../../../../../components/loader';
import Flex from '../../../../../components/Flex';

const ResultDetail = ({
  result,
  handleCloseClick,
  sidebarOpen,
}: {
  result: Object,
  handleCloseClick: Function,
  sidebarOpen: boolean,
}) => {
  const renderResult: Function = () => [
    <Headbar key="job-detail-header">
      <Pull>
        <Breadcrumbs icon="list-detail-view">
          <Crumb active>{result.job_instanceid}</Crumb>
        </Breadcrumbs>
      </Pull>
      <Pull right>
        <Control text="Close" icon="cross" big onClick={handleCloseClick} />
      </Pull>
    </Headbar>,
    <Box fill top key="job-detail-content">
      <ResultData result={result} />
    </Box>,
  ];

  return (
    <Flex className={`job-result-info ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Resize top />
      {result ? renderResult() : <Loader />}
    </Flex>
  );
};

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
  const { sidebarOpen } = state.api.currentUser.data.storage;

  return { result, sidebarOpen };
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
  }),
  onlyUpdateForKeys(['result', 'sidebarOpen'])
)(ResultDetail);
