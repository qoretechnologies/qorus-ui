/* @flow */
import React, { Component } from 'react';
import Modal from '../../../components/modal';
import { Controls, Control } from '../../../components/controls';
import Dropdown, { Control as DToggle, Item as DItem } from '../../../components/dropdown';

export default class OptionModal extends Component {
  props: {
    onSaveClick: Function,
    onCloseClick: Function,
    model: Object,
  };

  state: {
    value: string | number
  } = {
    value: this.props.model.value,
  };

  handleInputChange: Function = (event: EventHandler): void => {
    this.setState({
      value: event.target.value,
    });
  };

  handleDropdownItemClick: Function = (event: EventHandler, value: any): void => {
    this.setState({
      value,
    });
  };

  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    this.props.onSaveClick(this.props.model, this.state.value);
  };

  renderValue() {
    const { model } = this.props;
    let min = undefined;
    let max = undefined;

    switch (this.props.model.expects) {
      case 'bool':
        return (
          <Dropdown id="option">
            <DToggle>{ this.state.value.toString() }</DToggle>
            <DItem
              title="true"
              action={this.handleDropdownItemClick}
            />
            <DItem
              title="false"
              action={this.handleDropdownItemClick}
            />
          </Dropdown>
        );
      case 'integer':
        if (model.interval) {
          min = model.interval[0] > model.interval[1] ? model.interval[1] : model.interval[0];
          max = model.interval[1] > model.interval[0] ? model.interval[1] : model.interval[0];
        }

        return (
          <input
            type="number"
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
            onChange={this.handleInputChange}
            className="form-control"
            value={this.state.value}
          />
        );
    }
  }

  render() {
    const { model, onCloseClick } = this.props;

    return (
      <Modal>
        <Modal.Header
          titleId="option"
          onClose={onCloseClick}
        >
          { model.name }
        </Modal.Header>
        <form onSubmit={this.handleFormSubmit}>
          <Modal.Body>
            <h4> Description </h4>
            <p>{ model.desc }</p>
            <h4> Expects </h4>
            <code>{ model.expects }</code>
            <h4> Interval </h4>
            <p>{ model.interval ? JSON.stringify(model.interval) : 'No data' }</p>
            <h4> Default Value </h4>
            <code>{ model.default.toString() }</code>
            <h4> Current  Value </h4>
            { this.renderValue() }
          </Modal.Body>
          <Modal.Footer>
            <Controls noControls grouped>
              <Control
                type="submit"
                label="Save"
                btnStyle="success"
                big
              />
            </Controls>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
