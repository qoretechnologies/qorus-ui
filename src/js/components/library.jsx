import React, { Component, PropTypes } from 'react';

import { Item, Pane } from './tabs';
import SourceCode from './source_code';

import { pureRender } from './utils';

@pureRender
export default class LibraryTab extends Component {
  static propTypes = {
    library: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.setInitialActiveDomId(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setInitialActiveDomId(nextProps);
  }

  getDomId(func, step) {
    let id = func.name;
    if (step) id = `${step.name}.${id}`;

    return `func.${id}`;
  }

  setInitialActiveDomId() {
    const domIds = this.mergeFuncs().map(fn => fn.id);
    if (!this.state ||
        domIds.findIndex(domId => domId === this.state.activeDomId) < 0) {
      this.setState({ activeDomId: domIds[0] });
    }
  }

  handleTabChange = (domId) => {
    this.setState({ activeDomId: domId });
  };

  compareFuncs(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return +1;
    return 0;
  }

  mergeFuncs() {
    const { library } = this.props;

    return Object.keys(library).reduce((funcs, name) => (
      library[name].reduce((fns, fn) => (
        fns.concat({ id: this.getDomId(fn), fn })
      ), funcs)
    ), []);
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

  renderFuncs() {
    const { library } = this.props;

    return (
      <ul className="nav nav-pills nav-stacked">
        {Object.keys(library).map((name) => {
          if (!library[name].length) return null;

          return (
            <li role="presentation" className="disabled" key={name}>
              <a><h5>{name}</h5></a>
              <ul className="nav nav-pills nav-stacked">
                {library[name].map((func, idx) => (
                  <Item
                    key={idx}
                    slug={this.getDomId(func, null)}
                    name={this.renderFuncHeading(func)}
                    active={this.getDomId(func, null) === this.state.activeDomId}
                    tabChange={this.handleTabChange}
                  />
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    );
  }

  // renderStepFuncs() {
  //   return (
  //     <li role="presentation" className="disabled">
  //       <a><h5>StepFuncs</h5></a>
  //       <ul className="nav nav-pills nav-stacked">
  //       {this.props.library.stepfuncs.
  //        sort(::this.compareStepInfoFuncs).
  //        map((step, stepIdx) => (
  //         <li key={stepIdx} role="presentation" className="disabled">
  //           <a><h6>{step.name}</h6></a>
  //           <ul className="nav nav-pills nav-stacked">
  //             {(step.functions || []).map((func, funcIdx) => (
  //               <Item
  //                 key={funcIdx}
  //                 slug={this.getDomId(func, step)}
  //                 name={this.renderFuncHeading(func)}
  //                 active={this.getDomId(func, step) === this.state.activeDomId}
  //                 tabChange={this.handleTabChange}
  //               />
  //             ))}
  //           </ul>
  //         </li>
  //       ))}
  //       </ul>
  //     </li>
  //   );
  // }

  renderCodeTabs() {
    return (
      <div className="tab-content">
        {this.mergeFuncs().map(({ id, fn }, funcIdx) => (
          <Pane
            key={funcIdx}
            slug={id}
            name={fn.name}
            active={id === this.state.activeDomId}
          >
            <SourceCode lineOffset={parseInt(fn.offset, 10)}>
              {fn.body}
            </SourceCode>
          </Pane>
        ))}
      </div>
    );
  }


  render() {
    if (!this.mergeFuncs().length) {
      return (
        <div className="pane-lib">
          <p>Library not defined</p>
        </div>
      );
    }

    return (
      <div className="row pane-lib">
        <div className="col-sm-3 pane-lib__fns">
          <div className="well well-sm">
            <nav>
              { this.renderFuncs() }
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
