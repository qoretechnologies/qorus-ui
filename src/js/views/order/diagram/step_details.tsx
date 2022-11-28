import { Component } from 'react';
import ContentByType from '../../../components/ContentByType';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import { DateColumn, DateColumnHeader } from '../../../components/DateColumn';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import { IdColumn, IdColumnHeader } from '../../../components/IdColumn';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { Table, Tbody, Td, Th, Tr } from '../../../components/new_table';
import PaneItem from '../../../components/pane_item';
import Toolbar from '../../../components/toolbar';
import { INTERFACE_ICONS } from '../../../constants/interfaces';
import { canSkip, groupInstances } from '../../../helpers/orders';
import modal from '../../../hocomponents/modal';
import { StatusLabel } from '../../workflows/tabs/list/row';
import Errors from '../errors';
import Skip from './skip';

@modal()
export default class StepDetailTable extends Component {
  props: {
    step: string;
    instances: Array<any>;
    steps: any;
    onSkipSubmit: Function;
    order: any;
    openModal: any;
    closeModal: any;
  } = this.props;

  componentWillMount() {
    this.setup(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.step !== nextProps.step || this.props.instances !== nextProps.instances) {
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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentStep' does not exist on type 'Rea... Remove this comment to see the full error message
    this.props.onSkipSubmit(this.state.currentStep, value, noretry);
  };

  handleSkipClick = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property '_modal' does not exist on type 'StepDeta... Remove this comment to see the full error message
    this.props.openModal(
      <Skip
        onClose={this.props.closeModal}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'steps' does not exist on type 'Readonly<... Remove this comment to see the full error message
        steps={this.state.steps}
        // @ts-ignore
        instances={this.props.instances}
        onSubmit={this.handleSkipSubmit}
      />
    );
  };

  handleModalClose = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property '_modal' does not exist on type 'StepDeta... Remove this comment to see the full error message
    this.context.closeModal(this._modal);
  };

  handleDropdownItemClick = (ind) => () => {
    this.setState({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'steps' does not exist on type 'Readonly<... Remove this comment to see the full error message
      currentStep: this.state.steps.find((s) => s.ind === ind),
    });
  };

  renderDropdownItems() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'steps' does not exist on type 'Readonly<... Remove this comment to see the full error message
    return this.state.steps.map((step, index) => (
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      <Item
        key={index}
        title={`${step.ind} - ${step.stepname}`}
        action={this.handleDropdownItemClick(step.ind)}
      />
    ));
  }

  renderDropdown() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'steps' does not exist on type 'Readonly<... Remove this comment to see the full error message
    if (this.state.steps.length === 1) return undefined;

    return (
      <Dropdown id="steps">
        {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: string; }' is missing the follow... Remove this comment to see the full error message */}
        <Control>
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'currentStep' does not exist on type 'Rea... Remove this comment to see the full error message */}
          {`${this.state.currentStep.ind} - ${this.state.currentStep.stepname}`}
        </Control>
        {this.renderDropdownItems()}
      </Dropdown>
    );
  }

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentStep' does not exist on type 'Rea... Remove this comment to see the full error message
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
                  <StatusLabel text={data.stepstatus} label={data.stepstatus.toLowerCase()} />
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
          <Errors order={order} filterByStepId={data.stepid} tableId="stepErrors" compact />
        </PaneItem>
      </div>
    );
  }
}
