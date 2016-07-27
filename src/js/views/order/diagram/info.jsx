import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import Table, { Section, Row, Cell, EditableCell } from 'components/table';
import Date from 'components/date';
import Datepicker from 'components/datepicker';
import AutoComponent from 'components/autocomponent';
import Error from '../../workflow/tabs/list/modals/error';

import { pureRender } from 'components/utils';

import { getStatusLabel } from '../../../helpers/orders';
import actions from 'store/api/actions';

@pureRender
export default class DiagramInfoTable extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  handlePriorityChange = (priority) => {
    this.props.dispatch(
      actions.orders.setPriority(this.props.data, priority)
    );
  };

  handleDateChange = (d) => {
    if (moment().isAfter(d)) {
      this._modal = (
        <Error
          onClose={this.handleModalCloseClick}
          message="Cannot reschedule to a date in past"
        />
      );

      this.context.openModal(this._modal);
    } else {
      const date = moment(d).format();

      this.props.dispatch(
        actions.orders.reschedule(this.props.data, date)
      );
    }
  };

  handleModalCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  render() {
    const { ...data } = this.props.data;

    return (
      <Table className="table table-bordered table-condensed">
        <Section type="body">
          <Row>
            <Cell tag="th"> Instance ID </Cell>
            <Cell>{ data.workflow_instanceid }</Cell>
            <Cell tag="th"> Status </Cell>
            <Cell>
              <span className={`label label-${getStatusLabel(data.workflowstatus)}`}>
                {data.workflowstatus}
              </span>
            </Cell>
          </Row>
          <Row>
            <Cell tag="th"> Started </Cell>
            <Cell>
              <Date date={data.started} />
            </Cell>
            <Cell tag="th"> Custom </Cell>
            <Cell>{ data.custom_status }</Cell>
          </Row>
          <Row>
            <Cell tag="th"> Modified </Cell>
            <Cell>
              <Date date={data.modified} />
            </Cell>
            <Cell tag="th"> Priority </Cell>
            <EditableCell
              value={data.priority}
              type="number"
              min={0}
              max={999}
              onSave={this.handlePriorityChange}
            />
          </Row>
          <Row>
            <Cell tag="th"> Completed </Cell>
            <Cell>
              <Date date={data.completed} />
            </Cell>
            <Cell tag="th"> Parent ID </Cell>
            <Cell>{ data.workflow_parent_instanceid }</Cell>
          </Row>
          <Row>
            <Cell tag="th"> Scheduled </Cell>
            <Cell>
              <Datepicker
                date={data.scheduled}
                onApplyDate={this.handleDateChange}
                futureOnly
              />
            </Cell>
            <Cell tag="th"> Synchronous </Cell>
            <Cell>
              <AutoComponent>
                { data.synchronous !== 0 }
              </AutoComponent>
            </Cell>
          </Row>
        </Section>
      </Table>
    );
  }
}
