import React, { Component, PropTypes } from 'react';
import ErrorsTable from './errorsTable';


import { pureRender } from 'components/utils';


@pureRender
export default class ErrorsTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired,
    globalErrors: PropTypes.array.isRequired
  }

  render() {
    return (
      <div>
        <ErrorsTable
          heading='Workflow definitions'
          errors={this.props.errors}
          onRemove={() => {}}
          onEdit={() => {}}
        />
        <ErrorsTable
          heading='Global definitions'
          errors={this.props.globalErrors}
          onClone={() => {}}
        />
      </div>
    );
  }
}
