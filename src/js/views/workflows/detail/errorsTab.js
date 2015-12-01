import React, { Component, PropTypes } from 'react';
import ErrorsTable from './errorsTable';


import { pureRender } from 'components/utils';


@pureRender
export default class ErrorsTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    workflowErrors: PropTypes.array,
    globalErrors: PropTypes.array.isRequired
  }

  static defaultProps = {
    workflowErrors: []
  }

  render() {
    return (
      <div>
        <ErrorsTable
          heading='Workflow definitions'
          errors={this.props.workflowErrors}
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
