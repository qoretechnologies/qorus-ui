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
import Code from '../../../components/code';
import StepsTab from '../../order/diagram/graph';
import LogTab from './log_tab';
import ErrorsTab from './errors_tab';
import InfoTab from './info_tab';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import Releases from '../../../containers/releases';

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
    const navbar = document.querySelector('.navbar').clientHeight;
    const paneHeader = document.querySelector('.pane__content .pane__header').clientHeight;
    const panetabs = document.querySelector('.pane__content .nav-tabs').clientHeight;
    const top = navbar + paneHeader + panetabs + 20;

    return window.innerHeight - top;
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
  }

  render() {
    const { workflow, systemOptions, paneTab } =
      this.props;

    if (!workflow) return null;

    return (
      <DetailPane
        width={this.props.width || 600}
        onClose={this.handleClose}
        onResize={this.props.onResize}
      >
        <article>
          <WorkflowsHeader workflow={workflow} />
          <Tabs
            className="pane__tabs"
            active={paneTab}
            tabChange={this.props.changePaneTab}
          >
            <Pane name="Detail">
              <DetailTab key={workflow.name} workflow={workflow} systemOptions={systemOptions} />
            </Pane>
            <Pane name="Code">
              <Code
                data={workflow.lib}
                heightUpdater={this.getHeight}
                location={this.props.location}
              />
            </Pane>
            <Pane
              name="Steps"

            >
              <div
                style={{
                  height: '100%',
                  overflow: 'auto',
                }}
                ref={this.diagramRef}
              >
                <StepsTab workflow={workflow} />
              </div>
            </Pane>
            <Pane name="Log">
              <LogTab
                resource={`workflows/${workflow.id}`}
                location={this.props.location}
              />
            </Pane>
            <Pane name="Errors">
              <ErrorsTab location={this.props.location} workflow={workflow} />
            </Pane>
            <Pane name="Mappers">
              <MappersTable mappers={workflow.mappers} />
            </Pane>
            <Pane name="Valuemaps">
              <Valuemaps vmaps={workflow.vmaps} />
            </Pane>
            <Pane name="Releases">
              <Releases
                component={workflow.name}
                compact
                location={this.props.location}
                key={workflow.name}
              />
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
