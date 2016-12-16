/* @flow */
import React from 'react';

import ErrorsContainer from '../../../containers/errors';

type Props = {
  workflow: Object,
  location: Object,
};

const ErrorsTab: Function = ({ workflow, location }: Props): React.Element<any> => (
  <div>
    <ErrorsContainer
      title="Workflow errors"
      type="workflow"
      id={workflow.id}
      compact
      location={location}
    />
    <ErrorsContainer
      title="Global errors"
      type="global"
      compact
      location={location}
    />
  </div>
);

export default ErrorsTab;
