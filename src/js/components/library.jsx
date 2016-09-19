import React, { Component, PropTypes } from 'react';

import { Item, Pane } from './tabs';
import SourceCode from './source_code';

import { pureRender } from './utils';

@pureRender
export default class LibraryTab extends Component {
  static propTypes = {
    library: PropTypes.object.isRequired,
    mainCode: PropTypes.string,
  };

  defaultProps = {
    library: {},
  };

  state = {
    activeDomId: null,
  };

  componentDidMount() {
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
    let activeDomId;
    if (this.props.mainCode) {
      activeDomId = 'main_code';
    } else {
      const domIds = this.mergeFuncs().map(fn => fn.id);
      activeDomId = domIds[0];
      if (!this.state ||
        domIds.findIndex(domId => domId === this.state.activeDomId) < 0) {
        this.setState({ activeDomId: domIds[0] });
      }
    }

    if (!this.state || activeDomId !== this.state.activeDomId) {
      this.setState({ activeDomId });
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
    const { library = {} } = this.props;

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
    const { library = {}, mainCode } = this.props;
    const { activeDomId = null } = this.state;

    return (
      <ul className="nav nav-pills nav-stacked">
        {mainCode ? (
          <Item
            key="main_code"
            slug="main_code"
            name="Main code"
            tabChange={this.handleTabChange}
            active={activeDomId === 'main_code'}
          />
        ) : null }
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
                    active={this.getDomId(func, null) === activeDomId}
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

  renderCodeTabs() {
    return (
      <div className="tab-content">
        {
          this.props.mainCode ? (
            <Pane
              slug="main_code"
              name="main_code"
              key="main_code"
              active={this.state.activeDomId === 'main_code'}
            >
              <SourceCode >
                {this.props.mainCode}
              </SourceCode>
            </Pane>

          ) : null
        }
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
    if (!this.mergeFuncs().length && !this.props.mainCode) {
      return (
        <div className="pane-lib">
          <p className="no-data">Library not defined</p>
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
