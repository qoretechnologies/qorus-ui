import React, { Component, PropTypes } from 'react';
import Table, { Section, Row, Cell } from '../table';
import EditableCell from '../table/editable_cell';
import { Control } from '../controls';
import SystemOptions from './system_options';


import { pureRender } from '../utils';


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
@pureRender
export default class Options extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    onSet: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };


  /**
   * Sets up state to cache last option.
   */
  componentWillMount() {
    this.setState({
      lastOption: null,
      lastOptionSet: false,
    });
  }


  /**
   * Removes cached last option from state if it has been set.
   */
  componentWillReceiveProps() {
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
    return this.state.lastOption ?
      this.props.model.options.concat(this.state.lastOption) :
      this.props.model.options;
  }


  /**
   * Gets available options by filtering options from model prop.
   *
   * @return {array}
   */
  getUnusedSystemOptions() {
    return this.props.systemOptions.filter(sysOpt => (
      this.props.model.options.findIndex(mdlOpt => (
        mdlOpt.name === sysOpt.name
      )) < 0
    ));
  }


  /**
   * Sets new option value by calling `onSet` prop.
   *
   * If set option is the cached option, it is marked as set.
   *
   * @param {object} opt
   * @param {string} value
   */
  setOption(opt, value) {
    this.props.onSet(Object.assign({}, opt, { value }));

    if (opt === this.state.lastOption) {
      this.setState({ lastOptionSet: true });
    }
  }


  /**
   * Caches option so it can be edited without setting.
   *
   * @param {object} opt
   */
  addOption(opt) {
    this.setState({
      lastOption: opt,
      lastOptionSet: false,
    });
  }


  /**
   * Gets notified when option editing is canceled.
   *
   * If editing of cached option is canceled, it is removed if it has
   * not been set already.
   *
   * @param {object} opt
   */
  cancelOptionEdit(opt) {
    if (opt === this.state.lastOption && !this.state.lastOptionSet) {
      this.setState({
        lastOption: null,
        lastOptionSet: false,
      });
    }
  }


  /**
   * Deletes option by calling `onDelete` prop.
   *
   * @param {object} opt
   */
  deleteOption(opt) {
    this.props.onDelete(opt);
  }


  /**
   * Yields cells with option data and controls to manage it.
   *
   * @param {Object} opt
   * @return {Generator<ReactElement>}
   */
  *renderTableCells(opt) {
    yield (
      <Cell className="name">{opt.name}</Cell>
    );

    const onSave = this.setOption.bind(this, opt);
    const onCancel = this.cancelOptionEdit.bind(this, opt);
    yield (
      <EditableCell
        value={opt.value}
        startEdit={opt === this.state.lastOption}
        onSave={onSave}
        onCancel={onCancel}
      />
    );

    const action = this.deleteOption.bind(this, opt);
    yield (
      <Cell>
        <Control
          title="Remove"
          btnStyle="danger"
          icon="times"
          action={action}
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
      yield (
        <Row data={opt} cells={::this.renderTableCells} />
      );
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

    yield (
      <Section type="body" data={opts} rows={::this.renderTableRows} />
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div className="options">
        <h4>Options</h4>
        <div>
          {!this.getModelOptions().length && (
            <p>No options found.</p>
          )}
          {!!this.getModelOptions().length && (
            <Table
              data={this.getModelOptions()}
              sections={::this.renderTableSections}
              className="table table-condensed table-striped table--small"
            />
          )}
          <SystemOptions
            options={this.getUnusedSystemOptions()}
            onAdd={::this.addOption}
          />
        </div>
      </div>
    );
  }
}
