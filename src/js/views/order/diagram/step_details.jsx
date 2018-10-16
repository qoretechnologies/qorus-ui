import React, { Component, PropTypes } from 'react';

import Skip from './skip';
import { Table, Td, Th, Tr, Tbody, Thead } from 'components/new_table';
import Date from 'components/date';
import Dropdown, { Control, Item } from 'components/dropdown';
import { Control as Button } from 'components/controls';
import Autocomponent from 'components/autocomponent';
import { pureRender } from 'components/utils';
import { groupInstances, canSkip } from '../../../helpers/orders';
import Toolbar from '../../../components/toolbar';

@pureRender
export default class StepDetailTable extends Component {
  static propTypes = {
    step: PropTypes.string.isRequired,
    instances: PropTypes.array,
    steps: PropTypes.object,
    onSkipSubmit: PropTypes.func,
  };

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

    return (
      <div>
        <Toolbar mb>{this.renderDropdown()}</Toolbar>
        <Table condensed bordered className="text-table">
          <Tbody>
            <Tr>
              <Th> Name </Th>
              <Td colspan={3}>{data.stepname}</Td>
            </Tr>
            <Tr>
              <Th> Type </Th>
              <Td colspan={3}>{data.steptype}</Td>
            </Tr>
            <Tr>
              <Th> Started </Th>
              <Td>
                <Date date={data.started} />
              </Td>
              <Th> Skipped </Th>
              <Td>
                <Autocomponent>{data.skip}</Autocomponent>{' '}
                {canSkip(data) && (
                  <Button iconName="edit" action={this.handleSkipClick} />
                )}
              </Td>
            </Tr>
            <Tr>
              <Th> Completed </Th>
              <Td>
                <Date date={data.completed} />
              </Td>
              <Th> Subwfl </Th>
              <Td>{data.subworkflow_id}</Td>
            </Tr>
            <Tr>
              <Th> Status </Th>
              <Td>
                <span
                  className={`label status-${data.stepstatus.toLowerCase()}`}
                >
                  {data.stepstatus}
                </span>
              </Td>
              <Th> Ind </Th>
              <Td>{data.ind}</Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
    );
  }
}
