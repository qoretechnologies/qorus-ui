/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from '../../../store/api/actions';
import DetailPane from '../../../components/pane';
import Tabs, { Pane } from '../../../components/tabs';
import WorkflowsHeader from './header';
import DetailTab from './detail_tab';
import LibraryTab from '../../../components/library';
import StepsTab from './steps_tab';
import LogTab from './log_tab';
import ErrorsTab from './errors_tab';
import InfoTab from './info_tab';
import MappersTable from '../../../containers/mappers';

const workflowSelector: Function = (state: Object, props: Object): Object => (
  state.api.workflows.data.find((wf: Object) => wf.id === parseInt(props.paneId, 10))
);

const errorSelector: Function = (state: Object): Array<Object> => (
  state.api.errors
);

const selector = createSelector(
  [
    workflowSelector,
    errorSelector,
  ], (workflow, errors) => ({
    workflow,
    errors,
  })
);

@compose(
  connect(
    selector,
    {
      load: actions.workflows.fetchLibSources,
      loadErrors: actions.errors.fetch,
    }
  ),
)
export default class WorkflowsDetail extends Component {
  props: {
    errors: Object,
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
  };

  componentWillMount() {
    this.props.load(this.props.paneId);
    this.props.loadErrors(`workflow/${this.props.paneId}`);
  }

  render() {
    const { workflow, errors, systemOptions, globalErrors, paneTab } =
      this.props;

    if (!workflow) return null;

    return (
      <DetailPane
        width={550}
        onClose={this.props.onClose}
      >
        <article>
          <WorkflowsHeader workflow={workflow} />
          <Tabs
            className="pane__tabs"
            active={paneTab}
            tabChange={this.props.changePaneTab}
          >
            <Pane name="Detail">
              <DetailTab workflow={workflow} systemOptions={systemOptions} />
            </Pane>
            <Pane name="Library">
              <LibraryTab library={workflow.lib} />
            </Pane>
            <Pane name="Steps">
              <StepsTab workflow={workflow} />
            </Pane>
            <Pane name="Log">
              <LogTab
                resource={`workflows/${workflow.id}`}
                location={this.props.location}
              />
            </Pane>
            <Pane name="Errors">
              <ErrorsTab
                workflow={workflow}
                errors={errors.data}
                globalErrors={globalErrors}
              />
            </Pane>
            <Pane name="Mappers">
              <MappersTable mappers={workflow.mappers} />
            </Pane>
            <Pane name="Info">
              <InfoTab workflow={workflow} />
            </Pane>
          </Tabs>
        </article>
      </DetailPane>
    );
  }
}
