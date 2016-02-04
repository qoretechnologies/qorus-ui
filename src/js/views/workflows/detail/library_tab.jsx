import React, { Component, PropTypes } from 'react';
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-qore';
import 'prism-plugins/wrapped-line-numbers';


import { Item, Pane } from 'components/tabs';


import classNames from 'classnames';
import { pureRender } from 'components/utils';


@pureRender
export default class LibraryTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
  };


  constructor(props) {
    super(props);

    this._codeTabs = null;
  }


  componentWillMount() {
    this.setInitialActiveDomId(this.props);
    this.setState({ wrapLines: true });
  }


  componentDidMount() {
    this.highlightEls();
  }


  componentWillReceiveProps(nextProps) {
    this.setInitialActiveDomId(nextProps);
  }


  componentDidUpdate() {
    this.highlightEls();
  }


  onTabChange(domId) {
    this.setState({ activeDomId: domId });
  }


  getDomId(func, step) {
    let id = func.name;
    if (step) id = `${step.name}.${id}`;

    return `func.${id}`;
  }


  setInitialActiveDomId(props) {
    const domIds = this.mergeWfAndStepFuncs(props).map(fn => fn.id);
    if (!this.state ||
        domIds.findIndex(domId => domId === this.state.activeDomId) < 0) {
      this.setState({ activeDomId: domIds[0] });
    }
  }


  highlightEls() {
    for (let i = 0, codeEls = this._codeTabs.querySelectorAll('code');
         i < codeEls.length;
         i += 1) {
      Prism.highlightElement(codeEls[i]);
    }
  }


  mergeWfAndStepFuncs(props) {
    const wfFuncs = props.workflow.wffuncs.reduce((funcs, func) => (
      funcs.concat({ id: this.getDomId(func), func })
    ), []);

    return props.workflow.stepinfo.reduce((fns, step) => (
      (step.functions || []).reduce((funcs, func) => (
        funcs.concat({ id: this.getDomId(func, step), func })
      ), fns)
    ), wfFuncs);
  }


  compareStepInfoFuncs(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return +1;
    return 0;
  }


  toggleWrapLines() {
    this.setState({ wrapLines: !this.state.wrapLines });
  }


  refCodeTabs(el) {
    this._codeTabs = el;
  }


  renderFuncHeading(func) {
    if (!func.type) return func.name;

    return (
      <span>
        <span className="label label-default">{func.type}</span>
        <br />
        {func.name}
        {func.version && ' '}
        {func.version && (
          <small>
            v{func.version}
            {func.patch && (`.${func.patch}`)}
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
      <li role="presentation" className="disabled">
        <a><h5>WfFuncs</h5></a>
        <ul className="nav nav-pills nav-stacked">
          {this.props.workflow.wffuncs.map((func, idx) => (
            <Item
              key={idx}
              slug={this.getDomId(func, null)}
              name={this.renderFuncHeading(func)}
              active={this.getDomId(func, null) === this.state.activeDomId}
              tabChange={::this.onTabChange}
            />
          ))}
        </ul>
      </li>
    );
  }


  renderStepFuncs() {
    return (
      <li role="presentation" className="disabled">
        <a><h5>StepFuncs</h5></a>
        <ul className="nav nav-pills nav-stacked">
        {this.props.workflow.stepinfo.
         sort(::this.compareStepInfoFuncs).
         map((step, stepIdx) => (
          <li key={stepIdx} role="presentation" className="disabled">
            <a><h6>{step.name}</h6></a>
            <ul className="nav nav-pills nav-stacked">
              {(step.functions || []).map((func, funcIdx) => (
                <Item
                  key={funcIdx}
                  slug={this.getDomId(func, step)}
                  name={this.renderFuncHeading(func)}
                  active={this.getDomId(func, step) === this.state.activeDomId}
                  tabChange={::this.onTabChange}
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
      <div className="tab-content" ref={::this.refCodeTabs}>
        {this.mergeWfAndStepFuncs(this.props).map(({ id, func }, funcIdx) => (
          <Pane
            key={funcIdx}
            slug={id}
            name={func.name}
            active={id === this.state.activeDomId}
          >
            <button
              type="button"
              className={classNames({
                btn: true,
                'btn-xs': true,
                'btn-default': !this.state.wrapLines,
                'btn-success': this.state.wrapLines,
                'wflw-lib__wrap-toggle': true,
              })}
              onClick={::this.toggleWrapLines}
              title={this.state.wrapLines ?
                     'Disable line wrap' :
                     'Wrap lines'}
            >
              <i className="fa fa-outdent"></i>
            </button>
            <pre
              className={classNames({
                'line-numbers': true,
                'wrapped-lines': this.state.wrapLines,
              })}
              data-start={parseInt(func.offset, 10) + 1}
            >
              <code className="language-qore">
                {func.body}
              </code>
            </pre>
          </Pane>
        ))}
      </div>
    );
  }


  render() {
    return (
      <div className="row wflw-lib">
        <div className="col-sm-3 wflw-lib__fns">
          <div className="well well-sm">
            <nav>
              <ul className="nav nav-pills nav-stacked">
                {this.renderWfFuncs()}
                {this.renderStepFuncs()}
              </ul>
            </nav>
          </div>
        </div>
        <div className="col-sm-9 wflw-lib__src">
          {this.renderCodeTabs()}
        </div>
      </div>
    );
  }
}
