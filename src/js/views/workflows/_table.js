import { Component, PropTypes } from 'react';
import Table, { Col } from 'components/table';
import Badge from 'components/badge';
import AutoStart from 'components/autostart';


import { omit, isEqual } from 'lodash';
import classNames from 'classnames';
import { pureRender } from 'components/utils';
import goTo from 'routes';


import actions from 'store/api/actions';
import { ORDER_STATES } from 'constants/orders';


function setAutostart(id, value) {
  return actions.workflows.action({
    body: JSON.stringify({
      action: 'setAutostart',
      autostart: value,
      // XXX This value will update state and is ignored by Workflow REST API
      exec_count: value
    })
  }, id);
}


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

  render() {
    const { workflows } = this.props;
    const { dispatch } = this.context;
    const cls = classNames([
      'table', 'table-striped', 'table-condensed', 'table-hover', 'table-fixed'
    ]);

    const rowClick = (id) => {
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
    };

    return (
      <Table collection={ workflows } className={ cls } rowClick={ rowClick }>
        <Col name='' className='narrow'>
          <i className='fa fa-square-o' />
        </Col>
        <Col name='Actions' className='narrow'>
          <a className='label label-warning'>
            <i className='fa fa-power-off' />
            </a>
          <a className='label label-success'><i className='fa fa-refresh' /></a>
        </Col>
        <Col name='Autostart' className='narrow'
          transMap={{
            autostart: 'autostart',
            exec_count: 'execCount'
          }}>
          <AutoStart
            inc={ (id, value) => dispatch(setAutostart(id, value)) }
            dec={ (id, value) => dispatch(setAutostart(id, value)) } />
        </Col>
        <Col name='Execs' dataKey='exec_count' className='narrow' />
        <Col name='ID' dataKey='id' className='narrow' />
        <Col name='Name' dataKey='name' className='name' cellClassName='name' />
        <Col name='Version' dataKey='version' className='narrow' />
        {
          ORDER_STATES.map(state => {
            let transMap;
            const { name, short, label } = state;

            transMap = {};
            transMap[name] = 'val';

            return (
              <Col name={ short }
                className='narrow'
                cellClassName='narrow'
                transMap={ transMap }
                key={ name }>
                <Badge label={ label } />
              </Col>
            );
          })
        }
        <Col name='Total' dataKey='TOTAL' className='narrow' />
      </Table>
    );
  }
}
