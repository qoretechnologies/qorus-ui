import React, { Component, PropTypes } from 'react';
import { pureRender } from 'components/utils';


import { TabNavigationItem } from 'components/tabs';


@pureRender
export default class LibraryTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  }


  constructor(props) {
    super(props);

    this.state = { activeFunc: null };
  }


  onTabChange(funcName) {
    this.setState({ activeFunc: funcName });
  }


  _compareStepInfoFuncs(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return +1;
    return 0;
  }


  renderFuncHeading(func) {
    if (!func.type) return func.name;

    return (
      <span>
        <span className='label label-default'>{func.type}</span>
        <br />
        {func.name}
        {func.version && ' '}
        {func.version && (
          <small>
            v{func.version}
            {func.patch && ('.' + func.patch)}
          </small>
        )}
      </span>
    );
  }


  renderWfFuncs() {
    if (!this.props.workflow.wffuncs || !this.props.workflow.wffuncs.length) {
      return null;
    }

    return (
      <li role='presentation' className='disabled'>
        <a><h5>WfFuncs</h5></a>
        <ul className='nav nav-pills nav-stacked'>
          {this.props.workflow.wffuncs.map((func, idx) => (
            <TabNavigationItem
              key={idx}
              slug={`wf.${func.name}`}
              name={this.renderFuncHeading(func)}
              active={`wf.${func.name}` === this.state.activeFunc}
              tabChange={this.onTabChange.bind(this)}
            />
          ))}
        </ul>
      </li>
    );
  }


  renderStepFuncs() {
    return (
      <li role='presentation' className='disabled'>
        <a><h5>StepFuncs</h5></a>
        <ul className='nav nav-pills nav-stacked'>
        {this.props.workflow.stepinfo.
         sort(this._compareStepInfoFuncs.bind(this)).
         map((step, stepIdx) => (
          <li key={stepIdx} role='presentation' className='disabled'>
            <a><h6>{step.name}</h6></a>
            <ul className='nav nav-pills nav-stacked'>
              {(step.functions || []).map((func, funcIdx) => (
                <TabNavigationItem
                  key={funcIdx}
                  slug={`step.${func.name}`}
                  name={this.renderFuncHeading(func)}
                  active={`step.${func.name}` === this.state.activeFunc}
                  tabChange={this.onTabChange.bind(this)}
                />
              ))}
            </ul>
          </li>
        ))}
        </ul>
      </li>
    );
  }


  render() {
    return (
      <div className='row'>
        <div className='col-sm-3'>
          <div className='well well-sm'>
            <nav>
              <ul className='nav nav-pills nav-stacked'>
                {this.renderWfFuncs()}
                {this.renderStepFuncs()}
              </ul>
            </nav>
          </div>
        </div>
        <div className='col-sm-9' />
      </div>
    );
  }
}
