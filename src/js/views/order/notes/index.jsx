// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Intent, Callout } from '@blueprintjs/core';

import Box from '../../../components/box';
import actions from '../../../store/api/actions';
import NotesList from './table';
import Toolbar from '../../../components/toolbar';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import PaneItem from '../../../components/pane_item';
import withDispatch from '../../../hocomponents/withDispatch';

const orderSelector = (state, props) =>
  state.api.orders.data.find(
    w => parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  );

const userSelector = state => state.api.currentUser.data;

const selector = createSelector(
  [orderSelector, userSelector],
  (order, user) => ({
    notes: order.notes,
    count: order.note_count,
    order,
    user,
  })
);

@connect(selector)
@withDispatch()
export default class NotesView extends Component {
  props: {
    params: Object,
    notes: Array<Object>,
    order: Object,
    dispatchAction: Function,
    user: Object,
  } = this.props;

  componentWillMount() {
    this.setState({
      value: '',
      error: false,
    });
  }

  handleTextareaChange = event => {
    this.setState({
      value: event.target.value,
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    this.submitForm();
  };

  handleKeyUp = event => {
    event.persist();

    if (event.which === 13 && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.submitForm();
    }
  };

  submitForm() {
    if (/\S/.test(this.state.value) && this.state.value.length >= 3) {
      this.props.dispatchAction(
        actions.orders.addNote,
        this.props.order.workflow_instanceid,
        this.state.value,
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
          {this.state.error && (
            <Callout
              intent={Intent.DANGER}
              icon="warning-sign"
              title="Note too short"
            >
              Please type at least 3 characters
            </Callout>
          )}
          <form onSubmit={this.handleFormSubmit}>
            <textarea
              className="bp3-input bp3-fill"
              placeholder="Type note... (CTRL/CMD+Enter to submit)"
              rows="2"
              onChange={this.handleTextareaChange}
              onKeyDown={this.handleKeyUp}
              value={this.state.value}
            />
            <Toolbar mt mb>
              <ButtonGroup>
                <Button
                  type="submit"
                  text="Add note"
                  icon="add"
                  intent={Intent.PRIMARY}
                  big
                />
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
