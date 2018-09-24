/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { includes, isArray, isObject, size } from 'lodash';
import {
  ControlGroup,
  InputGroup,
  ButtonGroup,
  Button,
} from '@blueprintjs/core';

import Toolbar from '../../components/toolbar';
import Box from '../../components/box';
import Loader from '../../components/loader';
import Dropdown, { Control, Item } from '../../components/dropdown';
import Tree from '../../components/tree';
import Container from '../../components/container';

type Props = {
  sync: boolean,
  loading: boolean,
  collection: Object,
  dispatch: Function,
};

import actions from '../../store/api/actions';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import titleManager from '../../hocomponents/TitleManager';

const ocmdSelector: Function = (state: Object): Object => state.api.ocmd;

const viewSelector: Function = createSelector(
  [ocmdSelector],
  (ocmd: Object) => ({
    collection: ocmd.data,
    loading: ocmd.loading,
    sync: ocmd.sync,
  })
);

@connect(viewSelector)
@titleManager('OCMD')
export default class OCMDView extends Component {
  props: Props;

  state: {
    value: string,
    collection: ?Object,
    output: ?Object | ?string,
    showDropdown: boolean,
    filtered: ?Object,
    lastCommand: ?string,
    args: ?string,
    history: Array<Object>,
    historySelected: ?number,
  };

  state = {
    history: [],
    historySelected: 0,
    collection: {},
    value: '',
    args: '',
    output: {},
    lastCommand: '',
    showDropdown: false,
    filtered: {},
  };

  componentWillMount() {
    this.props.dispatch(
      actions.ocmd.action({
        body: JSON.stringify({
          action: 'call',
          method: 'help',
        }),
      })
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.loading && nextProps.sync) {
      if (size(this.state.collection) === 0) {
        this.setState({
          collection: nextProps.collection,
          filtered: {},
        });
      } else {
        this.setState({
          output: nextProps.collection,
        });
      }
    }
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (size(prevState.collection) === 0 && this.refs.command)
      this.refs.command.focus();
  }

  handleDropdownItemClick: Function = (event: Object, value: string): void => {
    this.setState({
      value,
      showDropdown: false,
    });

    this.refs.command.focus();
  };

  handleInputChange: Function = (event: EventHandler): void => {
    const { value }: { value: string } = event.target;
    const showDropdown: boolean = !(value === '');
    const historySelected: number =
      value === '' ? size(this.state.history) : this.state.historySelected;
    const filtered: Object = {};

    Object.keys(this.state.collection).forEach(c => {
      if (includes(c, value)) {
        filtered[c] = this.state.collection[c];
      }
    });

    this.setState({
      value: event.target.value,
      historySelected,
      showDropdown,
      filtered,
    });
  };

  handleInputKeyPress: Function = (event: KeyboardEvent): void => {
    if (
      this.state.history.length &&
      (event.which === 38 || event.which === 40)
    ) {
      const { history } = this.state;
      let { historySelected } = this.state;
      const { which }: { which: number } = event;

      if (which === 38) {
        const dec = historySelected - 1;

        historySelected = dec < 0 ? historySelected : dec;
      } else if (which === 40) {
        const add = historySelected + 1;

        historySelected = add > size(history) - 1 ? historySelected : add;
      }

      const data = history[historySelected];

      this.setState({
        historySelected,
        value: data.value,
        args: data.args,
      });
    }
  };

  handleArgsChange: Function = (event: EventHandler): void => {
    this.setState({
      args: event.target.value,
    });
  };

  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    this.props.dispatch(
      actions.ocmd.action({
        body: JSON.stringify({
          action: 'call',
          method: this.state.value,
          parse_args: this.state.args,
        }),
      })
    );

    const history = this.state.history.slice();
    const cmd = { value: this.state.value, args: this.state.args };

    history.push(cmd);

    this.setState({
      value: '',
      args: '',
      output: {},
      historySelected: size(history),
      lastCommand: `${this.state.value} ${this.state.args}`,
      history,
    });

    this.refs.command.focus();
  };

  renderCommands: Function = (): Array<React.Element<Item>> => {
    const data: Object =
      size(this.state.filtered) !== 0
        ? this.state.filtered
        : this.state.collection;

    return Object.keys(data).map(
      (c, index): React.Element<Item> => (
        <Item
          key={index}
          title={c}
          action={this.handleDropdownItemClick}
          selected={this.state.value === c}
        />
      )
    );
  };

  renderInfo: Function = (): ?React.Element<any> => {
    const { value } = this.state;

    if (!value || !this.state.collection[value]) return undefined;

    return (
      <p className="command-info">
        <strong>Command description: </strong>
        <em>{this.state.collection[value].description}</em>
      </p>
    );
  };

  renderOutput: Function = (): React.Element<any> => {
    const { output } = this.state;

    if (isObject(output)) {
      if (output.err) {
        return <span className="command-error">Error: {output.desc}</span>;
      }

      return <Tree data={output} />;
    } else if (isArray(output)) {
      return output.map((o, index) => <Tree key={index} data={o} />);
    }

    return <span className="alert alert-info"> {output} </span>;
  };

  render() {
    if (size(this.state.collection) === 0) return <Loader />;

    return (
      <div>
        <Breadcrumbs>
          <Crumb>OCMD</Crumb>
        </Breadcrumbs>
        <Box top>
          <Toolbar>
            <form onSubmit={this.handleFormSubmit}>
              <ControlGroup className="pt-fill">
                <Dropdown id="ocmd" show={this.state.showDropdown}>
                  <Control btnStyle="info"> Command list </Control>
                  {this.renderCommands()}
                </Dropdown>

                <InputGroup
                  type="text"
                  name="ocmd-command"
                  onChange={this.handleInputChange}
                  onKeyDown={this.handleInputKeyPress}
                  placeholder="Type or select command..."
                  value={this.state.value}
                  ref="command"
                  autoComplete="off"
                />
                <InputGroup
                  type="text"
                  name="ocmd-args"
                  ref="args"
                  onChange={this.handleArgsChange}
                  placeholder="Arguments..."
                  value={this.state.args}
                  autoComplete="off"
                />
              </ControlGroup>
              <Button type="submit" style={{ display: 'none' }} />
            </form>
            <div className="row">
              <div className="col-sm-12">{this.renderInfo()}</div>
            </div>
          </Toolbar>
        </Box>
        <Box>
          <Container>
            {this.state.lastCommand && (
              <h4>Showing output for: {this.state.lastCommand}</h4>
            )}
            {this.state.output && this.renderOutput()}
          </Container>
        </Box>
      </div>
    );
  }
}
