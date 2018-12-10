/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import size from 'lodash/size';

import actions from '../../../store/api/actions';
import show from '../../../hocomponents/show-if-passed';
import titleManager from '../../../hocomponents/TitleManager';
import Pane from '../../../components/pane';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countArrayItemsInObject } from '../../../utils';
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
  location: Object,
  paneTab: string,
  model: Object,
  onClose: Function,
  paneId: string | number,
  lib: Object,
  width: number,
  onResize: Function,
  isTablet: boolean,
  configItems: Array<Object>,
}): React.Element<*> => (
  <Pane
    width={width || 600}
    onResize={onResize}
    onClose={onClose}
    title={`Job ${model.id}`}
    tabs={{
      tabs: [
        'Detail',
        'Process',
        { title: 'Mappers', suffix: `(${size(model.mappers)})` },
        { title: 'Value maps', suffix: `(${size(model.vmaps)})` },
        'Releases',
        {
          title: 'Config',
          suffix: `(${countArrayItemsInObject(configItems)})`,
        },
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
    (state: Object, props: Object): Object => ({
      jobsLoaded: state.api.jobs.sync,
      model: state.api.jobs.data.find(
        (job: Object): boolean => job.id === parseInt(props.paneId, 10)
      ),
    }),
    {
      fetchLibSources: actions.jobs.fetchLibSources,
      fetchCode: actions.jobs.fetchCode,
    }
  ),
  show((props: Object) => props.jobsLoaded),
  fetchLibSourceOnMountAndOnChange,
  mapProps(
    (props: Object): Object => ({
      ...props,
      lib: {
        ...{
          code: [
            {
              name: 'Job code',
              body: props.model.code,
            },
          ],
        },
        ...props.model.lib,
      },
      configItems: rebuildConfigHash(props.model),
    })
  ),
  titleManager(({ model }): string => model.name, 'Jobs', 'prefix')
)(Detail);