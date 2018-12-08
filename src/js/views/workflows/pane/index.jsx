/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from '../../../store/api/actions';
import DetailPane from '../../../components/pane';

import titleManager from '../../../hocomponents/TitleManager';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countArrayItemsInObject } from '../../../utils';
import WorkflowDetailTabs from '../tabs';

const workflowSelector: Function = (state: Object, props: Object): Object =>
  state.api.workflows.data.find(
    (wf: Object) => wf.id === parseInt(props.paneId, 10)
  );

const selector = createSelector(
  [workflowSelector],
  workflow => ({
    workflow,
  })
);

@compose(
  connect(
    selector,
    {
      load: actions.workflows.fetchLibSources,
    }
  )
)
@titleManager(
  (props: Object): string => props.workflow.normalizedName,
  'Workflows',
  'prefix'
)
export default class WorkflowsDetail extends Component {
  props: {
    systemOptions: Array<Object>,
    globalErrors: Array<Object>,
    paneTab: string | number,
    paneId: string | number,
    query: string,
    changePaneTab: Function,
    workflow: Object,
    onClose: Function,
    location: Object,
    loadErrors: Function,
    load: Function,
    onResize: Function,
    width: number,
    fetchParams: Object,
    band: string,
  };

  componentWillMount() {
    this.props.load(this.props.paneId, this.props.fetchParams.date);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.paneId !== nextProps.paneId) {
      this.props.load(nextProps.paneId, this.props.fetchParams.date);
    }
  }

  handleClose: Function = (): void => {
    this.props.onClose(['globalErrQuery', 'workflowErrQuery']);
  };

  render() {
    const {
      workflow,
      systemOptions,
      paneTab,
      band,
      width,
      onResize,
      location,
    } = this.props;
    const loaded: boolean = workflow && 'lib' in workflow;

    if (!loaded) {
      return null;
    }

    const configItems: Array<Object> = rebuildConfigHash(workflow, true);

    return (
      <DetailPane
        width={width || 600}
        onClose={this.handleClose}
        onResize={onResize}
        title={`Workflow ${workflow.id}`}
        tabs={{
          tabs: [
            'Detail',
            'Steps',
            'Order Stats',
            'Process',
            {
              title: 'Config',
              suffix: `(${countArrayItemsInObject(configItems)})`,
            },
            'Releases',
            {
              title: 'Value maps',
              suffix: `(${size(workflow.vmaps)})`,
            },
            {
              title: 'Mappers',
              suffix: `(${size(workflow.mappers)})`,
            },
            'Errors',
            'Code',
            'Log',
            'Info',
          ],
          queryIdentifier: 'paneTab',
        }}
      >
        <WorkflowDetailTabs
          workflow={workflow}
          systemOptions={systemOptions}
          activeTab={paneTab}
          band={band}
          isPane
          location={location}
        />
      </DetailPane>
    );
  }
}
