import React, { Component, PropTypes } from 'react';
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-qore';
import 'prismjs/plugins/line-numbers/prism-line-numbers';


import { TabNavigationItem, Tab } from 'components/tabs';


import { pureRender } from 'components/utils';


@pureRender
export default class LibraryTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  }


  constructor(props) {
    super(props);

    this.state = { activeDomId: null };
  }


  onTabChange(domId) {
    this.setState({ activeDomId: domId });
  }


  getDomId(func, step) {
    let id = func.name;
    if (step) id = `${step.name}.${id}`;

    return `func.${id}`;
  }


  mergeWfAndStepFuncs() {
    return this.props.workflow.wffuncs.concat(
      this.props.workflow.stepinfo.reduce((funcs, step) => (
        funcs.concat(step.functions || [])
      ), [])
    );
  }


  compareStepInfoFuncs(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return +1;
    return 0;
  }


  highlight(codeEl) {
    if (!codeEl) return;

    Prism.highlightElement(codeEl);
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
              slug={this.getDomId(func, null)}
              name={this.renderFuncHeading(func)}
              active={this.getDomId(func, null) === this.state.activeDomId}
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
         sort(this.compareStepInfoFuncs.bind(this)).
         map((step, stepIdx) => (
          <li key={stepIdx} role='presentation' className='disabled'>
            <a><h6>{step.name}</h6></a>
            <ul className='nav nav-pills nav-stacked'>
              {(step.functions || []).map((func, funcIdx) => (
                <TabNavigationItem
                  key={funcIdx}
                  slug={this.getDomId(func, step)}
                  name={this.renderFuncHeading(func)}
                  active={this.getDomId(func, step) === this.state.activeDomId}
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


  renderCodeTabs() {
    return (
      <div className='tab-content'>
        {this.mergeWfAndStepFuncs().map((func, funcIdx) => (
          <Tab
            key={funcIdx}
            slug={this.getDomId(func)}
            name={func.name}
            active={this.getDomId(func) === this.state.activeDomId}
          >
            <pre
              className='line-numbers'
              data-start={parseInt(func.offset, 10) + 1}
            >
              <code
                className='language-qore'
                ref={this.highlight.bind(this)}
              >
                {func.body}
              </code>
            </pre>
          </Tab>
        ))}
      </div>
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
        <div className='col-sm-9'>
          {this.renderCodeTabs()}
        </div>
      </div>
    );
  }
}
