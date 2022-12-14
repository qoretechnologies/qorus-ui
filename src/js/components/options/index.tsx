// @flow
import { Button, Intent } from '@blueprintjs/core';
import { Component } from 'react';
import NoData from '../nodata';
import PaneItem from '../pane_item';
import Table, { Cell, Row, Section } from '../table';
import EditableCell from '../table/editable_cell';
import SystemOptions from './system_options';

/**
 * Editable key-value table component.
 *
 * Available options passed in `systemOption` prop can added to
 * `options` property on `model` prop object. Addition triggers
 * `onSet` prop function with an option as an argument. Options can be
 * removed, which triggers `onDelete` prop function.
 *
 * Component's clients are responsible for updating props to reflect
 * changes. The only state which maintained is to streamline user
 * experience and prevent unwanted flickering.
 */
class Options extends Component {
  props: {
    model: any;
    systemOptions: Array<Object>;
    onSet: Function;
    onDelete: Function;
  } = this.props;

  /**
   * Sets up state to cache last opton.
   */
  componentWillMount() {
    this.setState({
      lastOption: null,
      lastOptionSet: false,
    });

    this.renderTableCells = this.renderTableCells.bind(this);
    this.renderTableRows = this.renderTableRows.bind(this);
    this.renderTableSections = this.renderTableSections.bind(this);
  }

  /**
   * Removes cached last option from state if it has been set.
   */
  componentWillReceiveProps() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'lastOptionSet' does not exist on type 'R... Remove this comment to see the full error message
    if (this.state.lastOptionSet) {
      this.setState({
        lastOption: null,
        lastOptionSet: false,
      });
    }
  }

  /**
   * Adds cached last option from state to options from model prop.
   *
   * @return {array}
   */
  getModelOptions() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
    const { model: { options = [] } = {} } = this.props;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'lastOption' does not exist on type 'Read... Remove this comment to see the full error message
    return this.state.lastOption
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'lastOption' does not exist on type 'Read... Remove this comment to see the full error message
        options.concat(this.state.lastOption)
      : options || [];
  }

  /**
   * Gets available options by filtering options from model prop.
   *
   * @return {array}
   */
  getUnusedSystemOptions() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
    const { systemOptions = [], model: { options = [] } = {} } = this.props;
    const opts = options || [];

    return systemOptions.filter(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      (sysOpt) => opts.findIndex((mdlOpt) => mdlOpt.name === sysOpt.name) < 0
    );
  }

  /**
   * Sets new option value by calling `onSet` prop.
   *
   * If set option is the cached option, it is marked as set.
   *
   * @param {object} opt
   * @param {string} value
   */
  setOption = (opt, value) => {
    this.props.onSet({ ...opt, value });

    // @ts-ignore ts-migrate(2339) FIXME: Property 'lastOption' does not exist on type 'Read... Remove this comment to see the full error message
    if (opt === this.state.lastOption) {
      this.setState({ lastOptionSet: true });
    }
  };

  /**
   * Caches option so it can be edited without setting.
   *
   * @param {object} opt
   */
  addOption = (opt) => {
    this.setState({
      lastOption: opt,
      lastOptionSet: false,
    });
  };

  /**
   * Gets notified when option editing is canceled.
   *
   * If editing of cached option is canceled, it is removed if it has
   * not been set already.
   *
   * @param {object} opt
   */
  cancelOptionEdit(opt) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'lastOption' does not exist on type 'Read... Remove this comment to see the full error message
    if (opt === this.state.lastOption && !this.state.lastOptionSet) {
      this.setState({
        lastOption: null,
        lastOptionSet: false,
      });
    }
  }

  /**
   * Yields cells with option data and controls to manage it.
   *
   * @param {Object} opt
   * @return {Generator<ReactElement>}
   */
  *renderTableCells(opt) {
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    yield <Cell className="name">{opt.name}</Cell>;

    const handleSave = (value) => this.setOption(opt, value);
    const handleCancel = () => this.cancelOptionEdit(opt);
    yield (
      <EditableCell
        value={opt.value || ''}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'lastOption' does not exist on type 'Read... Remove this comment to see the full error message
        startEdit={opt === this.state.lastOption}
        onSave={handleSave}
        onCancel={handleCancel}
        showControl
      />
    );

    const handleDelete = () => this.props.onDelete(opt);
    yield (
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      <Cell>
        <Button
          title="Remove"
          intent={Intent.DANGER}
          className="remove-option bp3-small"
          icon="cross"
          onClick={handleDelete}
        />
      </Cell>
    );
  }

  /**
   * Yields rows for table body.
   *
   * @param {Array<Object>} opts
   * @return {Generator<ReactElement>}
   * @see renderTableCells
   */
  *renderTableRows(opts) {
    for (const opt of opts) {
      yield <Row data={opt} cells={this.renderTableCells} />;
    }
  }

  /**
   * Yields table sections.
   *
   * @param {Array<Object>} opts
   * @return {Generator<ReactElement>}
   * @see renderTableRows
   */
  *renderTableSections(opts) {
    yield (
      <thead>
        <tr>
          <th>Options</th>
          <th>Value</th>
          <th className="narrow" />
        </tr>
      </thead>
    );

    yield <Section type="body" data={opts} rows={this.renderTableRows} />;
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <PaneItem title="Options">
        {!this.getModelOptions().length && <NoData />}
        {!!this.getModelOptions().length && (
          <Table
            // @ts-ignore ts-migrate(2322) FIXME: Type '{ data: any; sections: (opts: any) => Genera... Remove this comment to see the full error message
            data={this.getModelOptions()}
            sections={this.renderTableSections}
            className="table table-condensed table-striped table--small"
          />
        )}
        <SystemOptions options={this.getUnusedSystemOptions()} onAdd={this.addOption} />
      </PaneItem>
    );
  }
}

export default Options;
