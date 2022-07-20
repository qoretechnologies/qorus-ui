/* @flow */
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Box from '../../../../../components/box';
import { Breadcrumbs, Crumb } from '../../../../../components/breadcrumbs';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control } from '../../../../../components/controls';
import Flex from '../../../../../components/Flex';
import Headbar from '../../../../../components/Headbar';
import Loader from '../../../../../components/loader';
import Pull from '../../../../../components/Pull';
import Resize from '../../../../../components/resize/handle';
import patch from '../../../../../hocomponents/patchFuncArgs';
import actions from '../../../../../store/api/actions';
import ResultData from './data';

const ResultDetail = ({
  result,
  handleCloseClick,
  sidebarOpen,
}: {
  result: any;
  handleCloseClick: Function;
  sidebarOpen: boolean;
}) => {
  const renderResult: Function = () => [
    <Headbar key="job-detail-header">
      <Pull>
        <Breadcrumbs icon="list-detail-view">
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'job_instanceid' does not exist on type '... Remove this comment to see the full error message */}
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
    <Flex className={`job-result-info ${sidebarOpen ? 'sidebar-open' : ''}`} height="400px">
      {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ top: true; }' is missing the following pro... Remove this comment to see the full error message */}
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
  const result = state.api.jobresults.data.find((item) => item.job_instanceid === jobInstanceId);
  const { sidebarOpen } = state.api.currentUser.data.storage;

  return { result, sidebarOpen };
};

const prepareRequestParams = mapProps((props: any) => ({
  ...props,
  queryParams: {},
  // @ts-ignore ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Object... Remove this comment to see the full error message
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
  connect(jobResultSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobresults' does not exist on type '{}'.
    load: actions.jobresults.fetch,
  }),
  prepareRequestParams,
  patch('load', ['queryParams', 'instanceId']),
  loadOnMount,
  loadOnInstanceIdChanged,
  withHandlers({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'changeJobQuery' does not exist on type '... Remove this comment to see the full error message
    handleCloseClick:
      ({ changeJobQuery }: any) =>
      (): void => {
        changeJobQuery('');
      },
  }),
  onlyUpdateForKeys(['result', 'sidebarOpen'])
)(ResultDetail);
