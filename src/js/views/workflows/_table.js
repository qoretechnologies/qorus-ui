import React, { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';
import Badge from 'components/badge';
import AutoStart from 'components/autostart';
import WorkflowsControls from './_controls';


import classNames from 'classnames';
import { pureRender } from 'components/utils';
import goTo from 'routes';


import actions from 'store/api/actions';
import { ORDER_STATES } from 'constants/orders';


@pureRender
export default class WorkflowsTable extends Component {
  static propTypes = {
    workflows: PropTypes.array,
    detId: PropTypes.number
  }

  static contextTypes = {
    dispatch: PropTypes.func,
    route: PropTypes.object,
    params: PropTypes.object
  }

  activateWorkflow(id) {
    const shouldDeactivate =
      this.context.params.detailId &&
      parseInt(this.context.params.detailId, 10) === id;
    const change = {
      detailId: shouldDeactivate ? null : id,
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
    const { workflows } = this.props;
    const { dispatch } = this.context;
    const cls = classNames([
      'table', 'table-striped', 'table-condensed', 'table-hover', 'table-fixed'
    ]);

    return (
      <Table
          collection={ workflows }
          className={ cls }
          rowClick={ this.activateWorkflow.bind(this) }>
        <Col className='narrow'>
          <i className='fa fa-square-o' />
        </Col>
        <Col
          heading='Actions'
          className='narrow'
          props={rec => ({ workflow: rec })}
        >
          <WorkflowsControls />
        </Col>
        <Col
          heading='Autostart'
          className='narrow'
          props={rec => ({
            context: rec,
            autostart: rec.autostart,
            execCount: rec.exec_count
          })}
        >
          <AutoStart
            inc={ (id, value) => {
              dispatch(actions.workflows.setAutostart(id, value));
            } }
            dec={ (id, value) => {
              dispatch(actions.workflows.setAutostart(id, value));
            } } />
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
          className='name'
          cellClassName='name'
          props={rec => ({ name: rec.name })}
        />
        <Col
          heading='Version'
          className='narrow'
          props={rec => ({ version: rec.version })}
        />
        {
          ORDER_STATES.map((state, idx) => {
            let transMap;
            const { name, short, label } = state;

            transMap = {};
            transMap[name] = 'val';

            return (
              <Col
                key={ idx }
                name={ short }
                className='narrow'
                cellClassName='narrow'
                props={rec => ({ val: rec[name] })}
              >
                <Badge label={ label } />
              </Col>
            );
          })
        }
        <Col
          heading='Total'
          className='narrow'
          props={rec => ({ TOTAL: rec.TOTAL })}
        />
      </Table>
    );
  }
}
