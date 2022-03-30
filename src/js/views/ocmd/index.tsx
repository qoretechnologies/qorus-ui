/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { includes, isArray, isObject, size } from 'lodash';
import { ControlGroup, InputGroup } from '@blueprintjs/core';

import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../components/controls';
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

// @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
const ocmdSelector: Function = (state: Object): Object => state.api.ocmd;

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
const viewSelector: Function = createSelector(
  [ocmdSelector],
  (ocmd: Object) => ({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    collection: ocmd.data,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'loading' does not exist on type 'Object'... Remove this comment to see the full error message
    loading: ocmd.loading,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    sync: ocmd.sync,
  })
);

@connect(viewSelector)
@titleManager('OCMD')
export default class OCMDView extends Component {
  props: Props = this.props;

  state: {
    value: string,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    collection: ?Object,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    output: ?Object | ?string,
    showDropdown: boolean,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    filtered: ?Object,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    lastCommand: ?string,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    args: ?string,
    history: Array<Object>,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    historySelected: ?number,
  };

  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'state'.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ocmd' does not exist on type '{}'.
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

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
        value: data.value,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'args' does not exist on type 'Object'.
        args: data.args,
      });
    }
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleArgsChange: Function = (event: EventHandler): void => {
    this.setState({
      args: event.target.value,
    });
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    this.props.dispatch(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ocmd' does not exist on type '{}'.
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

  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  renderCommands: Function = (): Array<React.Element<Item>> => {
    const data: Object =
      size(this.state.filtered) !== 0
        ? this.state.filtered
        : this.state.collection;

    return Object.keys(data).map(
      // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
      (c, index): React.Element<Item> => (
        <Item
          key={c}
          title={c}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          action={this.handleDropdownItemClick}
          selected={this.state.value === c}
        />
      )
    );
  };

  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  renderOutput: Function = (): React.Element<any> => {
    const { output } = this.state;

    if (isObject(output)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'err' does not exist on type 'string | Ob... Remove this comment to see the full error message
      if (output.err) {
        return (
          <Alert bsStyle="danger" title="Error">
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'string | O... Remove this comment to see the full error message
            {output.desc}
          </Alert>
        );
      }

      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      return <Tree data={output} />;
    } else if (isArray(output)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'map' does not exist on type 'string | Ob... Remove this comment to see the full error message
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
            <Crumb>
              <Pull>
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                <form onSubmit={this.handleFormSubmit}>
                  <ButtonGroup>
                    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                    <Dropdown show={this.state.showDropdown}>
                      // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; icon: string; }' is miss... Remove this comment to see the full error message
                      <Control icon="list">Command list</Control>
                      {size(this.state.filtered) !== 0 ||
                      this.state.value === ''
                        ? this.renderCommands()
                        : null}
                    </Dropdown>
                  </ButtonGroup>
                  <ButtonGroup>
                    <ControlGroup className="vab">
                      <InputGroup
                        type="text"
                        name="ocmd-command"
                        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                        onChange={this.handleInputChange}
                        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'Keyboar... Remove this comment to see the full error message
                        onKeyDown={this.handleInputKeyPress}
                        placeholder="Type or select command..."
                        value={this.state.value}
                        ref="command"
                        autoComplete="off"
                        style={{ width: '350px' }}
                      />
                      <InputGroup
                        type="text"
                        name="ocmd-args"
                        ref="args"
                        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
                        onChange={this.handleArgsChange}
                        placeholder="Arguments..."
                        value={this.state.args}
                        autoComplete="off"
                        style={{ width: '350px' }}
                      />
                      <Button
                        type="submit"
                        icon="tick"
                        btnStyle="success"
                        big
                      />
                    </ControlGroup>
                  </ButtonGroup>
                </form>
              </Pull>
            </Crumb>
          </Breadcrumbs>
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
