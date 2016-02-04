import React, { Component, PropTypes } from 'react';
import Tabs, { Pane } from 'components/tabs';
import WorkflowsHeader from './header';
import DetailTab from './detailTab';
import LibraryTab from './libraryTab';
import LogTab from './logTab';
import ErrorsTab from './errorsTab';
import InfoTab from './infoTab';


import { pureRender } from 'components/utils';


import goTo from 'routes';
import apiActions from 'store/api/actions';


@pureRender
export default class WorkflowsDetail extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    systemOptions: PropTypes.array.isRequired,
    globalErrors: PropTypes.array.isRequired,
    tabId: PropTypes.string,
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


  loadDetailedDataIfChanged(nextProps) {
    if (this.state && this.state.lastWorkflowId === nextProps.workflow.id) {
      return;
    }

    this.setState({ lastWorkflowId: nextProps.workflow.id });

    this.context.dispatch(
      apiActions.errors.fetch(`workflow/${nextProps.workflow.id}`)
    );

    this.context.dispatch(
      apiActions.workflows.fetchLibSources(nextProps.workflow)
    );
  }


  changeTab(tabId) {
    goTo(
      this.context.router,
      'workflows',
      this.context.route.path,
      this.context.params,
      { tabId }
    );
  }


  render() {
    const { workflow, errors, systemOptions, globalErrors, tabId } =
      this.props;

    if (!workflow) return null;

    return (
      <article className="wflw">
        <WorkflowsHeader workflow={workflow} />
        <Tabs
          className="wflw__tabs"
          active={tabId}
          tabChange={::this.changeTab}
        >
          <Pane name="Detail">
            <DetailTab workflow={workflow} systemOptions={systemOptions} />
          </Pane>
          <Pane name="Library">
            <LibraryTab workflow={workflow} />
          </Pane>
          <Pane name="Steps" />
          <Pane name="Log">
            <LogTab workflow={workflow} />
          </Pane>
          <Pane name="Errors">
            <ErrorsTab
              workflow={workflow}
              errors={errors}
              globalErrors={globalErrors}
            />
          </Pane>
          <Pane name="Mappers" />
          <Pane name="Info">
            <InfoTab workflow={workflow} />
          </Pane>
        </Tabs>
      </article>
    );
  }
}
