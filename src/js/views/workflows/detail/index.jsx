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

const workflowSelector: Function = (state: Object, props: Object): Object =>
  state.api.workflows.data.find(
    (wf: Object) => wf.id === parseInt(props.paneId, 10)
  );

const errorSelector: Function = (state: Object): Array<Object> =>
  state.api.errors;

const selector = createSelector(
  [workflowSelector, errorSelector],
  (workflow, errors) => ({
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
  )
)
@titleManager(
  (props: Object): string => props.workflow.normalizedName,
  'Workflows',
  'prefix'
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
    onResize: Function,
    width: number,
    fetchParams: Object,
  };

  componentWillMount() {
    this.props.load(this.props.paneId, this.props.fetchParams.date);
    this.props.loadErrors(`workflow/${this.props.paneId}`);
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
      errors,
      band,
      width,
      onResize,
    } = this.props;
    const loaded: boolean =
      workflow && 'lib' in workflow && errors[`workflow/${workflow.id}`];

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
        {loaded && (
          <Box top>
            <Container fill>
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
                  <Code
                    data={workflow.lib}
                    heightUpdater={this.getHeight}
                    location={this.props.location}
                  />
                </SimpleTab>
                <SimpleTab name="steps">
                  <PaneItem title={workflow.normalizedName}>
                    <div
                      style={{
                        height: '100%',
                        overflow: 'auto',
                      }}
                      ref={this.diagramRef}
                    >
                      <StepsTab workflow={workflow} />
                    </div>
                  </PaneItem>
                </SimpleTab>
                <SimpleTab name="log">
                  <LogTab
                    resource={`workflows/${workflow.id}`}
                    location={this.props.location}
                  />
                </SimpleTab>
                <SimpleTab name="errors">
                  <ErrorsTab
                    location={this.props.location}
                    workflow={workflow}
                  />
                </SimpleTab>
                <SimpleTab name="mappers">
                  <MappersTable mappers={workflow.mappers} />
                </SimpleTab>
                <SimpleTab name="value maps">
                  <Valuemaps vmaps={workflow.vmaps} />
                </SimpleTab>
                <SimpleTab name="releases">
                  <Releases
                    component={workflow.name}
                    compact
                    location={this.props.location}
                    key={workflow.name}
                  />
                </SimpleTab>
                {workflow && workflow.process ? (
                  <SimpleTab name="process">
                    <InfoTable
                      object={{
                        ...workflow.process,
                        ...{ memory: workflow.process.priv_str },
                      }}
                      omit={['priv', 'rss', 'vsz', 'priv_str']}
                    />
                  </SimpleTab>
                ) : (
                  <SimpleTab name="process">
                    <NonIdealState
                      title="Process unavailable"
                      description="This workflow is not running under a process"
                      visual="warning-sign"
                    />
                  </SimpleTab>
                )}
                <SimpleTab name="order stats">
                  <StatsTab orderStats={workflow.order_stats} />
                </SimpleTab>
                <SimpleTab name="info">
                  <InfoTab workflow={workflow} />
                </SimpleTab>
              </SimpleTabs>
            </Container>
          </Box>
        )}
      </DetailPane>
    );
  }
}
