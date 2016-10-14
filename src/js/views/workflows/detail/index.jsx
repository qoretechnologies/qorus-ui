import React, { Component, PropTypes } from 'react';

import { pureRender } from 'components/utils';
import { goTo } from '../../../helpers/router';
import actions from 'store/api/actions';
import Tabs, { Pane } from '../../../components/tabs';
import WorkflowsHeader from './header';
import DetailTab from './detail_tab';
import LibraryTab from 'components/library';
import StepsTab from './steps_tab';
import LogTab from './log_tab';
import ErrorsTab from './errors_tab';
import InfoTab from './info_tab';
import MappersTable from '../../../containers/mappers';

@pureRender
export default class WorkflowsDetail extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    systemOptions: PropTypes.array.isRequired,
    globalErrors: PropTypes.array.isRequired,
    tabId: PropTypes.string,
    query: PropTypes.string,
    location: PropTypes.object,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
    router: PropTypes.object,
    route: PropTypes.object,
    params: PropTypes.object,
  };

  componentWillMount() {
    this.setState({ lastWorkflowId: null });
    this.loadDetailedDataIfChanged(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadDetailedDataIfChanged(nextProps);
  }

  loadDetailedDataIfChanged(props) {
    if (this.state && this.state.lastWorkflowId === props.workflow.id) {
      return;
    }

    this.setState({ lastWorkflowId: props.workflow.id });

    this.context.dispatch(
      actions.errors.fetch(`workflow/${props.workflow.id}`)
    );

    this.context.dispatch(
      actions.workflows.fetchLibSources(props.workflow)
    );
  }

  changeTab = (tabId) => {
    goTo(
      this.context.router,
      'workflows',
      this.context.route.path,
      this.context.params,
      { tabId }
    );
  };

  render() {
    const { workflow, errors, systemOptions, globalErrors, tabId } =
      this.props;

    if (!workflow) return null;

    return (
      <article>
        <WorkflowsHeader workflow={workflow} />
        <Tabs
          className="pane__tabs"
          active={tabId}
          tabChange={this.changeTab}
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
              errors={errors}
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
    );
  }
}
