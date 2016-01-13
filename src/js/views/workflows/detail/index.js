import React, { Component, PropTypes } from 'react';
import { TabGroup, Tab } from 'components/tabs';
import WorkflowsHeader from './header';
import DetailTab from './detailTab';
import LibraryTab from './libraryTab';
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
    tabId: PropTypes.string
  };

  static contextTypes = {
    dispatch: PropTypes.func,
    route: PropTypes.object,
    params: PropTypes.object
  };

  /**
   * Initialiazes component and fetches workflow errors.
   *
   * @param {object} props
   * @param {object} context
   */
  constructor(props, context) {
    super(props, context);

    this.state = { lastWorkflowId: null };
  }

  componentWillMount() {
    this.loadDetailedDataIfChanged(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadDetailedDataIfChanged(nextProps);
  }

  loadDetailedDataIfChanged(nextProps) {
    if (this.state.lastWorkflowId === nextProps.workflow.id) return;

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
      <div>
        <WorkflowsHeader workflow={workflow} />
        <TabGroup active={tabId} tabChange={this.changeTab.bind(this)}>
          <Tab name='Detail'>
            <DetailTab workflow={workflow} systemOptions={systemOptions} />
          </Tab>
          <Tab name='Library'>
            <LibraryTab workflow={workflow} />
          </Tab>
          <Tab name='Steps' />
          <Tab name='Log' />
          <Tab name='Errors'>
            <ErrorsTab
              workflow={workflow}
              errors={errors}
              globalErrors={globalErrors}
            />
          </Tab>
          <Tab name='Mappers' />
          <Tab name='Info'>
            <InfoTab workflow={workflow} />
          </Tab>
        </TabGroup>
      </div>
    );
  }
}
