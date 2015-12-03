import React, { Component, PropTypes } from 'react';
import ErrorsTable from './errorsTable';


import { pureRender } from 'components/utils';
import apiActions from 'store/api/actions';


@pureRender
export default class ErrorsTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    globalErrors: PropTypes.array.isRequired
  }

  static contextTypes = {
    dispatch: PropTypes.func
  }

  clone(err) {
    this.context.dispatch(
      apiActions.errors.create(`workflow/${this.props.workflow.id}`, err)
    );
  }

  update(err) {
    this.context.dispatch(
      apiActions.errors.update(`workflow/${this.props.workflow.id}`, err)
    );
  }

  remove(err) {
    this.context.dispatch(
      apiActions.errors.remove(`workflow/${this.props.workflow.id}`, err)
    );
  }

  getUnusedGlobalErrors() {
    return this.props.globalErrors.filter(gloErr => (
      this.props.errors.findIndex(err => (
        err.error === gloErr.error
      )) < 0
    ));
  }

  render() {
    return (
      <div>
        <ErrorsTable
          heading='Workflow definitions'
          errors={this.props.errors}
          onRemove={this.remove.bind(this)}
          onUpdate={this.update.bind(this)}
        />
        <ErrorsTable
          heading='Global definitions'
          errors={this.getUnusedGlobalErrors()}
          onClone={this.clone.bind(this)}
        />
      </div>
    );
  }
}
