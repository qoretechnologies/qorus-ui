// @flow
import { Component } from 'react';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls as ButtonGroup } from '../controls';
import Toolbar from '../toolbar';
import { pureRender } from '../utils';

/**
 * Drop-down component with a button to add options.
 */
class SystemOptions extends Component {
  props: {
    options: Array<Object>;
    onAdd: Function;
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
  onChange = (ev) => {
    this.setState({
      selected: this.props.options.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (opt) => opt.name === ev.currentTarget.value
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
  commit = (ev) => {
    ev.preventDefault();

    // @ts-ignore ts-migrate(2339) FIXME: Property 'selected' does not exist on type 'Readon... Remove this comment to see the full error message
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
            // @ts-ignore ts-migrate(2339) FIXME: Property 'selected' does not exist on type 'Readon... Remove this comment to see the full error message
            value={this.state.selected && this.state.selected.name}
            onChange={this.onChange}
          >
            {this.props.options.map((opt) => (
              // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              <option key={opt.name} value={opt.name}>
                {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
                {opt.name}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            btnStyle="primary"
            icon="plus"
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ options:... Remove this comment to see the full error message
            text={this.props.intl.formatMessage({ id: 'button.submit' })}
          />
          <Button
            type="button"
            onClick={this.cancel}
            icon="cross"
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ options:... Remove this comment to see the full error message
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
          // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ options:... Remove this comment to see the full error message
          text={this.props.intl.formatMessage({ id: 'button.add-option' })}
          icon="plus"
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
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'edit' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
        {this.state.edit ? this.renderOptions() : this.renderButton()}
      </Toolbar>
    );
  }
}

export default compose(pureRender, injectIntl)(SystemOptions);
