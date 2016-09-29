import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Control as Button } from 'components/controls';
import actions from 'store/api/actions';
import NotesList from './table';

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const userSelector = state => state.api.currentUser.data;

const selector = createSelector(
  [
    orderSelector,
    userSelector,
  ], (order, user) => ({
    notes: order.notes,
    count: order.note_count,
    order,
    user,
  })
);

@connect(selector)
export default class NotesView extends Component {
  static propTypes = {
    params: PropTypes.object,
    notes: PropTypes.array,
    order: PropTypes.object,
    dispatch: PropTypes.func,
    user: PropTypes.object,
  };

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
    if (/\S/.test(this.state.value) && this.state.value.length >= 3) {
      this.props.dispatch(
        actions.orders.addNote(
          this.props.order,
          this.state.value,
          this.props.user.username
        )
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
      <div id="notes-wrapper">
        {this.state.error && (
          <p className="alert alert-danger"> Note too short (please type at least 3 characters) </p>
        )}
        <form
          onSubmit={this.handleFormSubmit}
        >
          <textarea
            className="form-control"
            placeholder="Type note... (CTRL/CMD+Enter to submit)"
            rows="2"
            onChange={this.handleTextareaChange}
            onKeyDown={this.handleKeyUp}
            value={this.state.value}
          />
          <Button
            type="submit"
            label="Add note"
            icon="plus-circle"
            big
            btnStyle="success"
          />
        </form>
        <NotesList notes={this.props.notes} />
      </div>
    );
  }
}
