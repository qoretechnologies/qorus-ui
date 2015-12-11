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
    highlight: PropTypes.string
  }

  static contextTypes = {
    dispatch: PropTypes.func,
    route: PropTypes.object,
    params: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);

    this.state = { highlight: [] };
  }

  getHighlightIdx() {
    return this.props.workflows && this.props.highlight ?
      [this.props.workflows.findIndex(w => w.id === +this.props.highlight)] :
      [];
  }

  activateWorkflow(workflow, idx, ev) {
    if (ev.defaultPrevented) return;

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

  render() {
    return (
      <Table
        data={this.props.workflows}
        highlight={this.getHighlightIdx()}
        className='table table-striped table-condensed table-hover table-fixed'
        onRowClick={this.activateWorkflow.bind(this)}
      >
        <Col className='narrow'>
          <i className='fa fa-square-o' />
        </Col>
        <Col
          heading='Actions'
          className='narrow'
          childProps={rec => ({ workflow: rec })}
        >
          <WorkflowsControls />
        </Col>
        <Col
          heading='Autostart'
          className='narrow'
          childProps={rec => ({
            context: rec,
            autostart: rec.autostart,
            execCount: rec.exec_count
          })}
        >
          <AutoStart
            inc={(id, value) => {
              this.context.dispatch(actions.workflows.setAutostart(id, value));
            }}
            dec={(id, value) => {
              this.context.dispatch(actions.workflows.setAutostart(id, value));
            }}
          />
        </Col>
        <Col
          heading='Execs'
          className='narrow'
          props={rec => ({ execCount: rec.exec_count })}
        />
        <Col
          heading='ID'
          className='narrow'
          props={rec => ({ id: rec.id })}
        />
        <Col
          heading='Name'
          field='name'
          props={rec => ({ className: 'name', name: rec.name })}
        />
        <Col
          heading='Version'
          className='narrow'
          props={rec => ({ version: rec.version })}
        />
        {ORDER_STATES.map((state, idx) => (
          <Col
            key={idx}
            heading={state.short}
            className='narrow'
            childProps={rec => ({ val: rec[state.name] })}
          >
            <Badge label={state.label} />
          </Col>
        ))}
        <Col
          heading='Total'
          className='narrow'
          props={rec => ({ TOTAL: rec.TOTAL })}
        />
      </Table>
    );
  }
}
