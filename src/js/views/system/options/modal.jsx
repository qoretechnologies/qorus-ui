/* @flow */
import React, { Component } from 'react';
import Modal from '../../../components/modal';
import { Controls, Control } from '../../../components/controls';
import Dropdown, {
  Control as DToggle,
  Item as DItem,
} from '../../../components/dropdown';
import Box from '../../../components/box';
import PaneItem from '../../../components/pane_item';

export default class OptionModal extends Component {
  props: {
    onSave: Function,
    onClose: Function,
    model: Object,
  } = this.props;

  state: {
    value: string | number,
  } = {
    value: this.props.model.value || 'null',
  };

  componentDidMount() {
    window.addEventListener('keyup', this.handleEnterPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEnterPress);
  }

  handleInputChange: Function = (event: EventHandler): void => {
    this.setState({
      value: event.target.value,
    });
  };

  handleDropdownItemClick: Function = (
    event: EventHandler,
    value: any
  ): void => {
    this.setState({
      value,
    });
  };

  handleFormSubmit: Function = (event?: EventHandler): void => {
    if (event) {
      event.preventDefault();
    }

    this.props.onSave(this.props.model.name, this.state.value);
  };

  handleEnterPress = event => {
    console.log(event.key);

    if (event.key === 'Enter') {
      this.handleFormSubmit();
    }
  };

  renderValue() {
    const { model } = this.props;
    let min;
    let max;

    switch (this.props.model.expects) {
      case 'bool':
        return (
          <Dropdown id="option">
            <DToggle>{this.state.value.toString()}</DToggle>
            <DItem title="true" action={this.handleDropdownItemClick} />
            <DItem title="false" action={this.handleDropdownItemClick} />
          </Dropdown>
        );
      case 'integer':
        if (model.interval) {
          min =
            model.interval[0] > model.interval[1]
              ? model.interval[1]
              : model.interval[0];
          max =
            model.interval[1] === 'UNLIMITED'
              ? Number.MAX_SAFE_INTEGER
              : model.interval[1] > model.interval[0]
              ? model.interval[1]
              : model.interval[0];
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
    const { model, onClose } = this.props;

    return (
      <form onSubmit={this.handleFormSubmit}>
        <Modal hasFooter>
          <Modal.Header titleId="option" onClose={onClose}>
            {model.name}
          </Modal.Header>
          <Modal.Body>
            <Box fill top scrollY>
              <PaneItem title="Description">
                <p>{model.desc}</p>
              </PaneItem>
              <PaneItem title="Expects">
                <code>{model.expects}</code>
              </PaneItem>
              <PaneItem title="Interval">
                <p>
                  {model.interval ? JSON.stringify(model.interval) : 'No data'}
                </p>
              </PaneItem>
              <PaneItem title="Default value">
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
