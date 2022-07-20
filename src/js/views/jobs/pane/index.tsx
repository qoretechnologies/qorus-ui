/* @flow */
import size from 'lodash/size';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import Pane from '../../../components/pane';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import show from '../../../hocomponents/show-if-passed';
import titleManager from '../../../hocomponents/TitleManager';
import actions from '../../../store/api/actions';
import { countConfigItems } from '../../../utils';
import JobsDetailTabs from '../tabs';

const Detail = ({
  location,
  paneTab,
  onClose,
  model,
  lib,
  width,
  onResize,
  isTablet,
  configItems,
}: {
  location: any;
  paneTab: string;
  model: any;
  onClose: Function;
  paneId: string | number;
  lib: any;
  width: number;
  onResize: Function;
  isTablet: boolean;
  configItems: Array<Object>;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}) => (
  <Pane
    width={400}
    onResize={onResize}
    onClose={onClose}
    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
    title={model.name}
    tabs={{
      tabs: [
        'Detail',
        {
          title: 'Config',
          suffix: `(${countConfigItems(configItems)})`,
        },
        'Process',
        // @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
        { title: 'Mappers', suffix: `(${size(model.mappers)})` },
        // @ts-ignore ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
        { title: 'Valuemaps', suffix: `(${size(model.vmaps)})` },
        'Releases',
        'Code',
        'Log',
        'Info',
      ],
      queryIdentifier: 'paneTab',
    }}
  >
    <JobsDetailTabs
      model={model}
      isTablet={isTablet}
      lib={lib}
      activeTab={paneTab}
      location={location}
      isPane
    />
  </Pane>
);

const fetchLibSourceOnMountAndOnChange = lifecycle({
  async componentWillMount() {
    const { model, fetchLibSources } = this.props;
    await fetchLibSources(model);
  },

  async componentWillReceiveProps(nextProps) {
    const { model } = this.props;
    const { model: nextModel, fetchLibSources } = nextProps;

    if (nextModel.id !== model.id) {
      await fetchLibSources(nextModel);
    }
  },
});

export default compose(
  connect(
    (state: any, props: any): any => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      jobsLoaded: state.api.jobs.sync,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      model: state.api.jobs.data.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        (job: any): boolean => job.id === parseInt(props.paneId, 10)
      ),
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
      fetchLibSources: actions.jobs.fetchLibSources,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
      fetchCode: actions.jobs.fetchCode,
    }
  ),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  show((props: any) => props.jobsLoaded),
  fetchLibSourceOnMountAndOnChange,
  mapProps((props: any): any => ({
    ...props,
    lib: {
      ...{
        code: [
          {
            name: 'Job code',
            // @ts-ignore ts-migrate(2339) FIXME: Property 'model' does not exist on type 'Object'.
            body: props.model.code,
          },
        ],
      },
      // @ts-ignore ts-migrate(2339) FIXME: Property 'model' does not exist on type 'Object'.
      ...props.model.lib,
    },
    // @ts-ignore ts-migrate(2339) FIXME: Property 'model' does not exist on type 'Object'.
    configItems: rebuildConfigHash(props.model),
  })),
  // @ts-ignore ts-migrate(2339) FIXME: Property 'model' does not exist on type 'Object'.
  titleManager(({ model }): string => model.name, 'Jobs', 'prefix')
)(Detail);
