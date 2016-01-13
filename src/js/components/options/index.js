import React, { Component, PropTypes } from 'react';
import Table, { Col } from '../table';
import EditableCell from '../table/editableCell';
import { Control } from '../controls';
import SystemOptions from './systemOptions';


import { pureRender } from '../utils';


/**
 * Editable key-value table component.
 *
 * Available options passed in `systemOption` prop can added to
 * `options` property on `workflow` prop object. Addition triggers
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
    workflow: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    onSet: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  /**
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      lastOption: null,
      lastOptionSet: false
    };

    this.optionsColProps = this.optionsColProps.bind(this);
    this.valueColProps = this.valueColProps.bind(this);
    this.deleteColProps = this.deleteColProps.bind(this);
    this.addOption = this.addOption.bind(this);
  }

  /**
   * Removes cached last option from state if it has been set.
   */
  componentWillReceiveProps() {
    if (this.state.lastOptionSet) {
      this.setState({
        lastOption: null,
        lastOptionSet: false
      });
    }
  }

  /**
   * Adds cached last option from state to options from wofkflow prop.
   *
   * @return {array}
   */
  getWorkflowOptions() {
    return this.state.lastOption ?
      this.props.workflow.options.concat(this.state.lastOption) :
      this.props.workflow.options;
  }

  /**
   * Gets available options by filtering options from workflow prop.
   *
   * @return {array}
   */
  getUnusedSystemOptions() {
    return this.props.systemOptions.filter(sysOpt => (
      this.props.workflow.options.findIndex(wflOpt => (
        wflOpt.name === sysOpt.name
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
      lastOptionSet: false
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
        lastOptionSet: false
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

  optionsColProps(rec) {
    return { name: rec.name, className: 'name' };
  }

  valueColProps(rec) {
    return {
      value: rec.value,
      startEdit: rec === this.state.lastOption,
      onSave: this.setOption.bind(this, rec),
      onCancel: this.cancelOptionEdit.bind(this, rec)
    };
  }

  deleteColProps(rec) {
    return {
      action: this.deleteOption.bind(this, rec)
    };
  }

  /**
   * @return {ReactElement}
   */
  render() {
    return (
      <div className='options'>
        <h4>Options</h4>
        <div>
          {!this.getWorkflowOptions().length && (
            <p>No options found.</p>
          )}
          {!!this.getWorkflowOptions().length && (
            <Table
              data={this.getWorkflowOptions()}
              className='table table-condensed table-striped table-align-left'
            >
              <Col
                heading='Options'
                field='name'
                props={this.optionsColProps}
              />
              <Col
                heading='Value'
                comp={EditableCell}
                props={this.valueColProps}
              />
              <Col
                className='narrow'
                childProps={this.deleteColProps}
              >
                <Control
                  title='Remove'
                  btnStyle='danger'
                  icon='times'
                />
              </Col>
            </Table>
          )}
          <SystemOptions
            options={this.getUnusedSystemOptions()}
            onAdd={this.addOption}
          />
        </div>
      </div>
    );
  }
}
