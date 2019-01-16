/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { includes, isArray, isObject, size } from 'lodash';
import {
  ControlGroup,
  InputGroup,
  Button,
  ButtonGroup,
} from '@blueprintjs/core';

import Toolbar from '../../components/toolbar';
import Box from '../../components/box';
import Loader from '../../components/loader';
import Dropdown, { Control, Item } from '../../components/dropdown';
import Tree from '../../components/tree';
import Headbar from '../../components/Headbar';

type Props = {
  sync: boolean,
  loading: boolean,
  collection: Object,
  dispatch: Function,
};

import actions from '../../store/api/actions';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import titleManager from '../../hocomponents/TitleManager';
import Pull from '../../components/Pull';
import Alert from '../../components/alert';
import Flex from '../../components/Flex';

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
  props: Props = this.props;

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

  handleDropdownItemClick: Function = (event: Object, value: string): void => {
    this.setState({
      value,
      showDropdown: false,
    });
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

  renderOutput: Function = (): React.Element<any> => {
    const { output } = this.state;

    if (isObject(output)) {
      if (output.err) {
        return (
          <Alert bsStyle="danger" title="Error">
            {output.desc}
          </Alert>
        );
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
      <Flex>
        <Headbar>
          <Breadcrumbs>
            <Crumb active>OCMD</Crumb>
          </Breadcrumbs>
          <Pull right>
            <form onSubmit={this.handleFormSubmit}>
              <ButtonGroup>
                <Dropdown show={this.state.showDropdown}>
                  <Control iconName="list">Command list</Control>
                  {size(this.state.filtered) !== 0 || this.state.value === ''
                    ? this.renderCommands()
                    : null}
                </Dropdown>
              </ButtonGroup>
              <ButtonGroup>
                <ControlGroup className="vab">
                  <InputGroup
                    type="text"
                    name="ocmd-command"
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleInputKeyPress}
                    placeholder="Type or select command..."
                    value={this.state.value}
                    ref="command"
                    autoComplete="off"
                    style={{ width: '250px' }}
                  />
                  <InputGroup
                    type="text"
                    name="ocmd-args"
                    ref="args"
                    onChange={this.handleArgsChange}
                    placeholder="Arguments..."
                    value={this.state.args}
                    autoComplete="off"
                    style={{ width: '250px' }}
                  />
                </ControlGroup>
              </ButtonGroup>
            </form>
          </Pull>
        </Headbar>
        <Box top>
          {this.state.lastCommand && (
            <Toolbar mb>
              <h4>Showing output for: {this.state.lastCommand}</h4>
            </Toolbar>
          )}
          {this.state.output && this.renderOutput()}
        </Box>
      </Flex>
    );
  }
}
