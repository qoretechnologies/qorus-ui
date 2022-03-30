/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from '../../../store/api/actions';
import DetailPane from '../../../components/pane';

import titleManager from '../../../hocomponents/TitleManager';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countArrayItemsInObject, countConfigItems } from '../../../utils';
import WorkflowDetailTabs from '../tabs';

const workflowSelector: Function = (state: Object, props: Object): Object =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.workflows.data.find(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    (wf: Object) => wf.id === parseInt(props.paneId, 10)
  );

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      load: actions.workflows.fetchLibSources,
    }
  )
)
@titleManager(
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
  (props: Object): string => props.workflow.normalizedName,
  'Workflows',
  'prefix'
)
@mapProps((props: Object): Object =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
  props.workflow.code
    ? {
      ...props,
      lib: {
        ...{
          code: [
            {
              name: 'Workflow code',
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
              body: props.workflow.code,
            },
          ],
        },
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
        ...props.workflow.lib,
      },
    }
    : {
      ...props,
      lib: {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow' does not exist on type 'Object... Remove this comment to see the full error message
        ...props.workflow.lib,
      },
    }
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
  } = this.props;

  componentWillMount () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'date' does not exist on type 'Object'.
    this.props.load(this.props.paneId, this.props.fetchParams.date);
  }

  componentWillReceiveProps (nextProps: Object) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'paneId' does not exist on type 'Object'.
    if (this.props.paneId !== nextProps.paneId) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'paneId' does not exist on type 'Object'.
      this.props.load(nextProps.paneId, this.props.fetchParams.date);
    }
  }

  handleClose: Function = (): void => {
    this.props.onClose(['globalErrQuery', 'workflowErrQuery']);
  };

  render () {
    const {
      workflow,
      systemOptions,
      paneTab,
      band,
      width,
      onResize,
      location,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lib' does not exist on type '{ systemOpt... Remove this comment to see the full error message
      lib,
    } = this.props;
    const loaded: boolean = workflow && 'lib' in workflow;

    if (!loaded) {
      return null;
    }

    const configItemsCount: number = countConfigItems({
      ...rebuildConfigHash(workflow, true),
    });

    return (
      <DetailPane
        width={width || 600}
        onClose={this.handleClose}
        onResize={onResize}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        title={workflow.name}
        tabs={{
          tabs: [
            'Detail',
            {
              title: 'Config',
              suffix: `(${configItemsCount})`,
            },
            'Steps',
            'OrderStats',
            'Process',
            'Releases',
            {
              title: 'Valuemaps',
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
              suffix: `(${size(workflow.vmaps)})`,
            },
            {
              title: 'Mappers',
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
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
          lib={lib}
          isPane
          location={location}
        />
      </DetailPane>
    );
  }
}
