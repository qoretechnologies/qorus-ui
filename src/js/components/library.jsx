import React, { Component, PropTypes } from 'react';


import { Item, Pane } from 'components/tabs';
import SourceCode from 'components/source_code';


import { pureRender } from 'components/utils';


@pureRender
export default class LibraryTab extends Component {
  static propTypes = {
    model: PropTypes.object.isRequired,
  };


  componentWillMount() {
    this.setInitialActiveDomId(this.props);
  }


  componentWillReceiveProps(nextProps) {
    this.setInitialActiveDomId(nextProps);
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
    const domIds = this.mergeModelAndStepFuncs(props).map(fn => fn.id);
    if (!this.state ||
        domIds.findIndex(domId => domId === this.state.activeDomId) < 0) {
      this.setState({ activeDomId: domIds[0] });
    }
  }


  mergeModelAndStepFuncs(props) {
    const wfFuncs = props.model.lib.wffuncs.reduce((funcs, func) => (
      funcs.concat({ id: this.getDomId(func), func })
    ), []);

    return props.model.lib.stepfuncs.reduce((fns, step) => (
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
            {func.patch && `.${func.patch}`}
          </small>
        )}
      </span>
    );
  }


  renderModelFuncs() {
    if (!this.props.model.lib.wffuncs || !this.props.model.lib.wffuncs.length) {
      return null;
    }

    return (
      <li role="presentation" className="disabled">
        <a><h5>Funcs</h5></a>
        <ul className="nav nav-pills nav-stacked">
          {this.props.model.lib.wffuncs.map((func, idx) => (
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
        {this.props.model.lib.stepfuncs.
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
      <div className="tab-content">
        {this.mergeModelAndStepFuncs(this.props).map(({ id, func }, funcIdx) => (
          <Pane
            key={funcIdx}
            slug={id}
            name={func.name}
            active={id === this.state.activeDomId}
          >
            <SourceCode lineOffset={parseInt(func.offset, 10)}>
              {func.body}
            </SourceCode>
          </Pane>
        ))}
      </div>
    );
  }


  render() {
    return (
      <div className="row pane-lib">
        <div className="col-sm-3 pane-lib__fns">
          <div className="well well-sm">
            <nav>
              <ul className="nav nav-pills nav-stacked">
                {this.renderModelFuncs()}
                {this.renderStepFuncs()}
              </ul>
            </nav>
          </div>
        </div>
        <div className="col-sm-9 pane-lib__src">
          {this.renderCodeTabs()}
        </div>
      </div>
    );
  }
}
