/* @flow */
import React, { Component } from 'react';
import Box from '../../../components/box';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control, Controls } from '../../../components/controls';
import Dropdown, { Control as DToggle, Item as DItem } from '../../../components/dropdown';
import Modal from '../../../components/modal';
import PaneItem from '../../../components/pane_item';

export default class OptionModal extends Component {
  props: {
    onSave: Function;
    onClose: Function;
    model: Object;
  } = this.props;

  state: {
    value: string | number;
  } = {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
    value: this.props.model.value || 'null',
  };

  componentDidMount() {
    window.addEventListener('keyup', this.handleEnterPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEnterPress);
  }

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleInputChange: Function = (event: EventHandler): void => {
    this.setState({
      value: event.target.value,
    });
  };

  handleDropdownItemClick: Function = (
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
    event: EventHandler,
    value: any
  ): void => {
    this.setState({
      value,
    });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit: Function = (event?: EventHandler): void => {
    if (event) {
      event.preventDefault();
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
    this.props.onSave(this.props.model.name, this.state.value);
  };

  handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      this.handleFormSubmit();
    }
  };

  renderValue() {
    const { model } = this.props;
    let min;
    let max;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'expects' does not exist on type 'Object'... Remove this comment to see the full error message
    switch (this.props.model.expects) {
      case 'bool':
        return (
          <Dropdown id="option">
            {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; }' is missing the follow... Remove this comment to see the full error message */}
            <DToggle>{this.state.value.toString()}</DToggle>
            {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
            <DItem title="true" action={this.handleDropdownItemClick} />
            {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
            <DItem title="false" action={this.handleDropdownItemClick} />
          </Dropdown>
        );
      case 'integer':
        // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
        if (model.interval) {
          min =
            // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
            model.interval[0] > model.interval[1]
              ? // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
                model.interval[1]
              : // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
                model.interval[0];
          max =
            // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
            model.interval[1] === 'UNLIMITED'
              ? Number.MAX_SAFE_INTEGER
              : // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
              model.interval[1] > model.interval[0]
              ? // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
                model.interval[1]
              : // @ts-ignore ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message
                model.interval[0];
        }

        return (
          <input
            type="number"
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'ChangeE... Remove this comment to see the full error message
            onChange={this.handleInputChange}
            className="form-control"
            value={this.state.value}
            min={min}
            max={max}
          />
        );
      default:
        return (
          <input
            type="text"
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'ChangeE... Remove this comment to see the full error message
            onChange={this.handleInputChange}
            className="form-control"
            value={this.state.value}
          />
        );
    }
  }

  render() {
    const { model, onClose } = this.props;

    return (
      // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
      <form onSubmit={this.handleFormSubmit}>
        <Modal hasFooter>
          <Modal.Header titleId="option" onClose={onClose}>
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
            {model.name}
          </Modal.Header>
          <Modal.Body>
            <Box fill top scrollY>
              <PaneItem title="Description">
                {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'. */}
                <p>{model.desc}</p>
              </PaneItem>
              <PaneItem title="Expects">
                {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'expects' does not exist on type 'Object'... Remove this comment to see the full error message */}
                <code>{model.expects}</code>
              </PaneItem>
              <PaneItem title="Interval">
                <p>
                  {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'interval' does not exist on type 'Object... Remove this comment to see the full error message */}
                  {model.interval ? JSON.stringify(model.interval) : 'No data'}
                </p>
              </PaneItem>
              <PaneItem title="Default value">
                {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'default' does not exist on type 'Object'... Remove this comment to see the full error message */}
                <code>{model.default ? model.default.toString() : 'null'}</code>
              </PaneItem>
              <PaneItem title="Current value">{this.renderValue()}</PaneItem>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Controls noControls grouped>
              <Control label="Cancel" big onClick={this.props.onClose} />
              <Control type="submit" label="Save" btnStyle="success" big />
            </Controls>
          </Modal.Footer>
        </Modal>
      </form>
    );
  }
}
