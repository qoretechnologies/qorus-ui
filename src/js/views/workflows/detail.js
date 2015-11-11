import React, { Component, PropTypes } from 'react';
import { TabGroup, Tab } from 'components/tabs';
import WorkflowsHeader from './_header';


import { pureRender } from 'components/utils';
import goTo from 'routes';


@pureRender
export default class WorkflowsDetail extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    tabId: PropTypes.string
  }

  static contextTypes = {
    route: PropTypes.object,
    params: PropTypes.object
  }

  changeTab(tabId) {
    const { params, route } = this.context;

    goTo(
      'workflows',
      route.path,
      params,
      { tabId }
    );
  }

  render() {
    const { workflow, tabId } = this.props;

    if (!workflow) return null;

    return (
      <div>
        <WorkflowsHeader workflow={workflow} />
        <TabGroup active={ tabId } tabChange={this.changeTab.bind(this)}>
          <Tab name='Detail' />
          <Tab name='Library' />
          <Tab name='Steps' />
          <Tab name='Log' />
          <Tab name='Errors' />
          <Tab name='Mappers' />
          <Tab name='Info' />
        </TabGroup>
      </div>
    );
  }
}
