// @flow
import React, { Component } from 'react';

import { pureRender } from '../utils';
import Toolbar from '../toolbar';
import { Controls as ButtonGroup, Control as Button } from '../controls';
import { injectIntl } from 'react-intl';

/**
 * Drop-down component with a button to add options.
 */
@pureRender
@injectIntl
export default class SystemOptions extends Component {
  props: {
    options: Array<Object>,
    onAdd: Function,
  } = this.props;

  /**
   * Sets up state with default edit flag and no selected option.
   */
  componentWillMount() {
    this.setState({ edit: false, selected: null });
  }

  /**
   * Changes selected option.
   *
   * @param {Event} ev
   */
  onChange = ev => {
    this.setState({
      selected: this.props.options.find(
        opt => opt.name === ev.currentTarget.value
      ),
    });
  };

  /**
   * Start editing by showing options to add.
   */
  start = () => {
    this.setState({ edit: true, selected: this.props.options[0] });
  };

  /**
   * Cancels editing by hiding options to add.
   */
  cancel = () => {
    this.setState({ edit: false, selected: null });
  };

  /**
   * Adds new option by calling `onAdd` prop.
   *
   * @param {Event} ev
   */
  commit = ev => {
    ev.preventDefault();

    this.props.onAdd(this.state.selected);
    this.setState({ edit: false, selected: null });
  };

  /**
   * Returns a form to select new option to add.
   *
   * @return {ReactElement}
   */
  renderOptions() {
    return (
      <form className="form-inline" onSubmit={this.commit}>
        <ButtonGroup>
          <select
            className="form-control"
            value={this.state.selected && this.state.selected.name}
            onChange={this.onChange}
          >
            {this.props.options.map(opt => (
              <option key={opt.name} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            btnStyle="primary"
            iconName="plus"
            text={this.props.intl.formatMessage({ id: 'button.submit' })}
          />
          <Button
            type="button"
            onClick={this.cancel}
            iconName="cross"
            text={this.props.intl.formatMessage({ id: 'button.cancel' })}
          />
        </ButtonGroup>
      </form>
    );
  }

  /**
   * Returns a button to add new option.
   *
   * @return {ReactElement}
   */
  renderButton() {
    return (
      <ButtonGroup>
        <Button
          btnStyle="primary"
          onClick={this.start}
          disabled={!this.props.options.length}
          text={this.props.intl.formatMessage({ id: 'button.add-option' })}
          iconName="plus"
          big
        />
      </ButtonGroup>
    );
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <Toolbar mt>
        {this.state.edit ? this.renderOptions() : this.renderButton()}
      </Toolbar>
    );
  }
}
