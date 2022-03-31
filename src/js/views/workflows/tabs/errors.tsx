/* @flow */
import React from 'react';
import Flex from '../../../components/Flex';
import Tabs, { Pane } from '../../../components/tabs';
import ErrorsContainer from '../../../containers/errors';

type Props = {
  workflow: Object;
  location: Object;
};

const ErrorsTab: Function = ({
  workflow,
  location,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <Flex>
    {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
    <Tabs active="workflow">
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
      <Pane name="Workflow">
        <ErrorsContainer
          type="workflow"
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          id={workflow.id}
          compact
          location={location}
        />
      </Pane>
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
      <Pane name="Global">
        <ErrorsContainer type="global" compact location={location} />
      </Pane>
    </Tabs>
  </Flex>
);

export default ErrorsTab;
