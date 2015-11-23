import React, { Component, PropTypes } from 'react';
import { TabGroup, Tab } from 'components/tabs';
import { Groups, Group } from 'components/groups';
import Options from 'components/options';
import WorkflowsHeader from './header';


import { pureRender } from 'components/utils';
import goTo from 'routes';


@pureRender
export default class WorkflowsDetail extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
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
    const { workflow, options, tabId } = this.props;

    if (!workflow) return null;

    return (
      <div>
        <WorkflowsHeader workflow={workflow} />
        <TabGroup active={ tabId } tabChange={this.changeTab.bind(this)}>
          <Tab name='Detail'>
            <Groups>
              {
                (workflow.groups || []).map(g => (
                  <Group
                      key={g.name}
                      name={g.name}
                      url={`/groups/${g.name}`}
                      size={g.size}
                      disabled={!g.enabled} />
                ))
              }
            </Groups>
            <Options
                workflow={workflow}
                options={options}
                onAdd={() => {}}
                onChange={() => {}}
                onDelete={() => {}} />
          </Tab>
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
