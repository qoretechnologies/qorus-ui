import React, { Component, PropTypes } from 'react';

import Skip from './skip';
import Table, { Section, Row, Cell } from 'components/table';
import Date from 'components/date';
import Dropdown, { Control, Item } from 'components/dropdown';
import { Control as Button } from 'components/controls';
import Autocomponent from 'components/autocomponent';

import { pureRender } from 'components/utils';

import { getStatusLabel, groupInstances, canSkip } from '../../../helpers/orders';

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
    if (this.props.step !== nextProps.step ||
      this.props.instances !== nextProps.instances) {
      this.setup(nextProps);
    }
  }

  setup(props) {
    const grouped = groupInstances(props.instances);
    const steps = grouped[props.step].steps;

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

  handleDropdownItemClick = (ind) => () => {
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
      <Dropdown
        id="steps"
      >
        <Control>
          {`${this.state.currentStep.ind} - ${this.state.currentStep.stepname}`}
        </Control>
        { this.renderDropdownItems() }
      </Dropdown>
    );
  }

  render() {
    const { ...data } = this.state.currentStep;

    return (
      <div>
        <h4> Step Details </h4>
        { this.renderDropdown() }
        <Table className="table table-bordered table-condensed">
          <Section type="body">
            <Row>
              <Cell tag="th"> Name </Cell>
              <Cell colspan={3}>{ data.stepname }</Cell>
            </Row>
            <Row>
              <Cell tag="th"> Type </Cell>
              <Cell colspan={3}>{ data.steptype }</Cell>
            </Row>
            <Row>
              <Cell tag="th"> Started </Cell>
              <Cell>
                <Date date={data.started} />
              </Cell>
              <Cell tag="th"> Skipped </Cell>
              <Cell>
                <Autocomponent>
                  { data.skip }
                </Autocomponent>
                {' '}
                { canSkip(data) && (
                  <Button
                    icon="pencil"
                    action={this.handleSkipClick}
                    btnStyle="success"
                  />
                )}
              </Cell>
            </Row>
            <Row>
              <Cell tag="th"> Completed </Cell>
              <Cell>
                <Date date={data.completed} />
              </Cell>
              <Cell tag="th"> Subwfl </Cell>
              <Cell>{ data.subworkflow_id }</Cell>
            </Row>
            <Row>
              <Cell tag="th"> Status </Cell>
              <Cell>
                <span className={`label label-${getStatusLabel(data.stepstatus)}`}>
                  { data.stepstatus }
                </span>
              </Cell>
              <Cell tag="th"> Ind </Cell>
              <Cell>{ data.ind}</Cell>
            </Row>
          </Section>
        </Table>
      </div>
    );
  }
}
