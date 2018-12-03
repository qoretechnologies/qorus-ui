/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { NonIdealState } from '@blueprintjs/core';

import actions from '../../../store/api/actions';
import DetailPane from '../../../components/pane';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import DetailTab from './detail_tab';
import Code from '../../../components/code';
import StepsTab from '../../order/diagram/graph';
import LogTab from './log_tab';
import ErrorsTab from './errors_tab';
import InfoTab from './info_tab';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import Releases from '../../../containers/releases';
import InfoTable from '../../../components/info_table/index';
import Box from '../../../components/box';
import StatsTab from './stats';
import titleManager from '../../../hocomponents/TitleManager';
import Container from '../../../components/container';
import PaneItem from '../../../components/pane_item';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import ConfigItemsTable from '../../../components/ConfigItemsTable';

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

  getHeight: Function = (): number => {
    const { top } = document
      .querySelector('.pane__content .container-resizable')
      .getBoundingClientRect();

    return window.innerHeight - top - 60;
  };

  handleClose: Function = (): void => {
    this.props.onClose(['globalErrQuery', 'workflowErrQuery']);
  };

  diagramRef = (el: Object) => {
    if (el) {
      const copy = el;
      copy.scrollLeft = el.scrollWidth;
      const diff = (el.scrollWidth - el.scrollLeft) / 2;
      const middle = el.scrollWidth / 2 - diff;

      copy.scrollLeft = middle;
    }
  };

  render() {
    const {
      workflow,
      systemOptions,
      paneTab,
      band,
      width,
      onResize,
    } = this.props;
    const loaded: boolean = workflow && 'lib' in workflow;

    if (!loaded) {
      return null;
    }

    const configItems: Array<Object> = rebuildConfigHash(
      workflow.stepinfo,
      null,
      true
    );

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
              suffix: `(${configItems.length})`,
            },
            'Releases',
            {
              title: 'Value maps',
              suffix: `(${workflow.vmaps ? workflow.vmaps.length : 0})`,
            },
            {
              title: 'Mappers',
              suffix: `(${workflow.mappers ? workflow.mappers.length : 0})`,
            },
            'Errors',
            'Code',
            'Log',
            'Info',
          ],
          queryIdentifier: 'paneTab',
        }}
      >
        <Box top>
          <SimpleTabs activeTab={paneTab}>
            <SimpleTab name="detail">
              <DetailTab
                key={workflow.name}
                workflow={workflow}
                systemOptions={systemOptions}
                band={band}
              />
            </SimpleTab>
            <SimpleTab name="code">
              <Container fill>
                <Code
                  data={workflow.lib}
                  heightUpdater={this.getHeight}
                  location={this.props.location}
                />
              </Container>
            </SimpleTab>
            <SimpleTab name="steps">
              <PaneItem title={workflow.normalizedName}>
                <Container fill>
                  <div
                    style={{
                      height: '100%',
                      overflow: 'auto',
                    }}
                    ref={this.diagramRef}
                  >
                    <StepsTab workflow={workflow} />
                  </div>
                </Container>
              </PaneItem>
            </SimpleTab>
            <SimpleTab name="log">
              <Container fill>
                <LogTab
                  resource={`workflows/${workflow.id}`}
                  location={this.props.location}
                />
              </Container>
            </SimpleTab>
            <SimpleTab name="errors">
              <Container fill>
                <ErrorsTab location={this.props.location} workflow={workflow} />
              </Container>
            </SimpleTab>
            <SimpleTab name="mappers">
              <Container fill>
                <MappersTable mappers={workflow.mappers} />
              </Container>
            </SimpleTab>
            <SimpleTab name="value maps">
              <Container fill>
                <Valuemaps vmaps={workflow.vmaps} />
              </Container>
            </SimpleTab>
            <SimpleTab name="releases">
              <Container fill>
                <Releases
                  component={workflow.name}
                  compact
                  location={this.props.location}
                  key={workflow.name}
                />
              </Container>
            </SimpleTab>
            {workflow && workflow.process ? (
              <SimpleTab name="process">
                <Container fill>
                  <InfoTable
                    object={{
                      ...workflow.process,
                      ...{ memory: workflow.process.priv_str },
                    }}
                    omit={['priv', 'rss', 'vsz', 'priv_str']}
                  />
                </Container>
              </SimpleTab>
            ) : (
              <SimpleTab name="process">
                <Container fill>
                  <NonIdealState
                    title="Process unavailable"
                    description="This workflow is not running under a process"
                    visual="warning-sign"
                  />
                </Container>
              </SimpleTab>
            )}
            <SimpleTab name="config">
              <Container fill>
                <ConfigItemsTable items={configItems} />
              </Container>
            </SimpleTab>
            <SimpleTab name="order stats">
              <Container fill>
                <StatsTab orderStats={workflow.order_stats} />
              </Container>
            </SimpleTab>
            <SimpleTab name="info">
              <Container fill>
                <InfoTab workflow={workflow} />
              </Container>
            </SimpleTab>
          </SimpleTabs>
        </Box>
      </DetailPane>
    );
  }
}
