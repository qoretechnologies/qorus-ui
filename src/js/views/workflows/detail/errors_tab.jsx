/* @flow */
import React from 'react';

import ErrorsContainer from '../../../containers/errors';
import Flex from '../../../components/Flex';
import Tabs, { Pane } from '../../../components/tabs';

type Props = {
  workflow: Object,
  location: Object,
};

const ErrorsTab: Function = ({
  workflow,
  location,
}: Props): React.Element<any> => (
  <Flex>
    <Tabs active="workflow">
      <Pane name="Workflow">
        <ErrorsContainer
          type="workflow"
          id={workflow.id}
          compact
          location={location}
        />
      </Pane>
      <Pane name="Global">
        <ErrorsContainer type="global" compact location={location} />
      </Pane>
    </Tabs>
  </Flex>
);

export default ErrorsTab;
