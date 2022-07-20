// @flow
import { Callout, Intent } from '@blueprintjs/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Box from '../../../components/box';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import PaneItem from '../../../components/pane_item';
import Toolbar from '../../../components/toolbar';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';
import NotesList from './table';

const orderSelector = (state, props) =>
  state.api.orders.data.find(
    (w) => parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  );

const userSelector = (state) => state.api.currentUser.data;

const selector = createSelector([orderSelector, userSelector], (order, user) => ({
  notes: order.notes,
  count: order.note_count,
  order,
  user,
}));

@connect(selector)
@withDispatch()
export default class NotesView extends Component {
  props: {
    params: any;
    notes: Array<Object>;
    order: any;
    dispatchAction: Function;
    user: any;
  } = this.props;

  componentWillMount() {
    this.setState({
      value: '',
      error: false,
    });
  }

  handleTextareaChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.submitForm();
  };

  handleKeyUp = (event) => {
    event.persist();

    if (event.which === 13 && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.submitForm();
    }
  };

  submitForm() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
    if (/\S/.test(this.state.value) && this.state.value.length >= 3) {
      this.props.dispatchAction(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
        actions.orders.addNote,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'workflow_instanceid' does not exist on t... Remove this comment to see the full error message
        this.props.order.workflow_instanceid,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
        this.state.value,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message
        this.props.user.username
      );

      this.setState({
        value: '',
      });
    } else {
      this.setState({
        error: true,
      });
    }
  }

  render() {
    return (
      <Box top>
        <PaneItem title="New note">
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Readonly<... Remove this comment to see the full error message */}
          {this.state.error && (
            <Callout intent={Intent.DANGER} icon="warning-sign" title="Note too short">
              Please type at least 3 characters
            </Callout>
          )}
          <form onSubmit={this.handleFormSubmit}>
            <textarea
              className="bp3-input bp3-fill"
              placeholder="Type note... (CTRL/CMD+Enter to submit)"
              // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
              rows="2"
              onChange={this.handleTextareaChange}
              onKeyDown={this.handleKeyUp}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
              value={this.state.value}
            />
            <Toolbar mt mb>
              <ButtonGroup>
                <Button type="submit" text="Add note" icon="add" intent={Intent.PRIMARY} big />
              </ButtonGroup>
            </Toolbar>
          </form>
        </PaneItem>
        <PaneItem title="Notes history">
          <NotesList notes={this.props.notes} />
        </PaneItem>
      </Box>
    );
  }
}
