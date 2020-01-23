import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Skip from './skip';
import { Table, Td, Th, Tr, Tbody } from '../../../components/new_table';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import { pureRender } from '../../../components/utils';
import { groupInstances, canSkip } from '../../../helpers/orders';
import Toolbar from '../../../components/toolbar';
import ContentByType from '../../../components/ContentByType';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { DateColumnHeader, DateColumn } from '../../../components/DateColumn';
import { INTERFACE_ICONS } from '../../../constants/interfaces';
import { IdColumnHeader, IdColumn } from '../../../components/IdColumn';
import PaneItem from '../../../components/pane_item';
import Errors from '../errors';

@pureRender
export default class StepDetailTable extends Component {
  props: {
    step: string,
    instances: Array<any>,
    steps: Object,
    onSkipSubmit: Function,
    order: Object,
  } = this.props;

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  componentWillMount() {
    this.setup(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.step !== nextProps.step ||
      this.props.instances !== nextProps.instances
    ) {
      this.setup(nextProps);
    }
  }

  setup(props) {
    const grouped = groupInstances(props.instances);
    let steps = grouped[props.step].steps;

    steps = steps.sort((a, b) => {
      if (a.ind < b.ind) {
        return -1;
      }

      return 1;
    });

    this.setState({
      steps,
      currentStep: steps[0],
    });
  }

  handleSkipSubmit = (value, noretry) => {
    this.props.onSkipSubmit(this.state.currentStep, value, noretry);
  };

  handleSkipClick = () => {
    this._modal = (
      <Skip
        onClose={this.handleModalClose}
        steps={this.state.steps}
        onSubmit={this.handleSkipSubmit}
      />
    );

    this.context.openModal(this._modal);
  };

  handleModalClose = () => {
    this.context.closeModal(this._modal);
  };

  handleDropdownItemClick = ind => () => {
    this.setState({
      currentStep: this.state.steps.find(s => s.ind === ind),
    });
  };

  renderDropdownItems() {
    return this.state.steps.map((step, index) => (
      <Item
        key={index}
        title={`${step.ind} - ${step.stepname}`}
        action={this.handleDropdownItemClick(step.ind)}
      />
    ));
  }

  renderDropdown() {
    if (this.state.steps.length === 1) return undefined;

    return (
      <Dropdown id="steps">
        <Control>
          {`${this.state.currentStep.ind} - ${this.state.currentStep.stepname}`}
        </Control>
        {this.renderDropdownItems()}
      </Dropdown>
    );
  }

  render() {
    const { ...data } = this.state.currentStep;
    const { order } = this.props;

    return (
      <div>
        <PaneItem title="Step details">
          <Toolbar mb>{this.renderDropdown()}</Toolbar>
          <Table condensed bordered className="text-table">
            <Tbody>
              <Tr>
                <NameColumnHeader />
                <NameColumn name={data.stepname} />
                <Th icon="info-sign">Status</Th>
                <Td>
                  <span
                    className={`label status-${data.stepstatus.toLowerCase()}`}
                  >
                    {data.stepstatus}
                  </span>
                </Td>
              </Tr>
              <Tr>
                <Th icon="info-sign">Type</Th>
                <Td>{data.steptype}</Td>
                <Th icon="info-sign">Version</Th>
                <Td>{data.stepversion}</Td>
              </Tr>
              <Tr>
                <IdColumnHeader />
                <IdColumn>{data.stepid}</IdColumn>
                <Th icon="exclude-row">Skipped</Th>
                <Td>
                  <ContentByType content={data.skip} />{' '}
                  {canSkip(data) && (
                    <ButtonGroup>
                      <Button icon="edit" action={this.handleSkipClick} />
                    </ButtonGroup>
                  )}
                </Td>
              </Tr>
              <Tr>
                <DateColumnHeader>Started</DateColumnHeader>
                <DateColumn>{data.started}</DateColumn>

                <Th icon={INTERFACE_ICONS.workflow}>SubWF</Th>
                <Td>{data.subworkflow_instanceid}</Td>
              </Tr>
              <Tr>
                <DateColumnHeader>Completed</DateColumnHeader>
                <DateColumn>{data.completed}</DateColumn>
                <Th icon="info-sign">Ind</Th>
                <Td>{data.ind}</Td>
              </Tr>
            </Tbody>
          </Table>
        </PaneItem>
        <PaneItem title="Errors for this step">
          <Errors
            order={order}
            filterByStepId={data.stepid}
            tableId="stepErrors"
            compact
          />
        </PaneItem>
      </div>
    );
  }
}
