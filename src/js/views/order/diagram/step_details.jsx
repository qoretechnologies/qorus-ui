import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from 'components/table';
import Date from 'components/date';
import Dropdown, { Control, Item } from 'components/dropdown';

import { pureRender } from 'components/utils';

import { getStatusLabel, groupInstances } from 'helpers/orders';

@pureRender
export default class StepDetailTable extends Component {
  static propTypes = {
    step: PropTypes.string.isRequired,
    instances: PropTypes.array,
    steps: PropTypes.object,
  };

  componentWillMount() {
    this.setup(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.step !== nextProps.step) {
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

  handleDropdownItemClick = (ind) => (event, item) => {
    this.setState({
      currentStep: this.state.steps[ind],
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
              <Cell></Cell>
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
