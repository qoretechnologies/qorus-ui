import React, { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';
import Badge from 'components/badge';
import AutoStart from 'components/autostart';
import WorkflowsControls from './controls';


import { pureRender } from 'components/utils';
import goTo from 'routes';


import actions from 'store/api/actions';
import { ORDER_STATES } from 'constants/orders';


@pureRender
export default class WorkflowsTable extends Component {
  static propTypes = {
    workflows: PropTypes.array,
    shouldHighlight: PropTypes.func.isRequired
  };

  static contextTypes = {
    dispatch: PropTypes.func,
    route: PropTypes.object,
    params: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.workflowIdentifier = this.workflowIdentifier.bind(this);
    this.activateWorkflow = this.activateWorkflow.bind(this);
    this.actionsColChildProps = this.actionsColChildProps.bind(this);
    this.autostartColChildProps = this.autostartColChildProps.bind(this);
    this.execColProps = this.execColProps.bind(this);
    this.idColProps = this.idColProps.bind(this);
    this.nameColProps = this.nameColProps.bind(this);
    this.versionColProps = this.versionColProps.bind(this);
    this.totalColProps = this.totalColProps.bind(this);
    this.setAutostart = this.setAutostart.bind(this);
  }

  setAutostart(id, value) {
    this.context.dispatch(
      actions.workflows.setAutostart(id, value)
    );
  }

  workflowIdentifier(workflow) {
    return workflow.id;
  }

  activateWorkflow(workflow) {
    const shouldDeactivate =
      this.context.params.detailId &&
      parseInt(this.context.params.detailId, 10) === workflow.id;
    const change = {
      detailId: shouldDeactivate ? null : workflow.id,
      tabId: shouldDeactivate ? null : this.context.params.tabId
    };

    goTo(
      'workflows',
      this.context.route.path,
      this.context.params,
      change
    );
  }

  actionsColChildProps(rec) {
    return { workflow: rec };
  }

  autostartColChildProps(rec) {
    return {
      context: rec,
      autostart: rec.autostart,
      execCount: rec.exec_count
    };
  }

  execColProps(rec) {
    return { execCount: rec.exec_count };
  }

  idColProps(rec) {
    return { id: rec.id };
  }

  nameColProps(rec) {
    return { className: 'name', name: rec.name };
  }

  versionColProps(rec) {
    return { version: rec.version };
  }

  statesColChildProps(state, rec) {
    return { val: rec[state.name] };
  }

  totalColProps(rec) {
    return { TOTAL: rec.TOTAL };
  }

  render() {
    return (
      <Table
        data={this.props.workflows}
        identifier={this.workflowIdentifier}
        shouldHighlight={this.props.shouldHighlight}
        className='table table-striped table-condensed table-hover table-fixed'
        onRowClick={this.activateWorkflow}
      >
        <Col className='narrow'>
          <i className='fa fa-square-o' />
        </Col>
        <Col
          heading='Actions'
          className='narrow'
          childProps={this.actionsColChildProps}
        >
          <WorkflowsControls />
        </Col>
        <Col
          heading='Autostart'
          className='narrow'
          childProps={this.autostartColChildProps}
        >
          <AutoStart inc={this.setAutostart} dec={this.setAutostart} />
        </Col>
        <Col
          heading='Execs'
          className='narrow'
          field='execCount'
          props={this.execColProps}
        />
        <Col
          heading='ID'
          className='narrow'
          field='id'
          props={this.idColProps}
        />
        <Col
          heading='Name'
          className='name'
          field='name'
          props={this.nameColProps}
        />
        <Col
          heading='Version'
          className='narrow'
          field='version'
          props={this.versionColProps}
        />
        {ORDER_STATES.map((state, idx) => {
          const childProps = this.statesColChildProps.bind(this, state);

          return (
            <Col
              key={idx}
              heading={state.short}
              className='narrow'
              childProps={childProps}
            >
              <Badge label={state.label} />
            </Col>
          );
        })}
        <Col
          heading='Total'
          className='narrow'
          field='TOTAL'
          props={this.totalColProps}
        />
      </Table>
    );
  }
}
