// @flow
import React from 'react';
import SimpleTab from './tab';
import Flex from '../Flex';

type Props = {
  activeTab: string,
  children: any,
};

const SimpleTabs: Function = ({ activeTab, children }: Props) => (
  <Flex>
    {React.Children.map(
      children,
      // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
      (child: Object): React.Element<any> =>
        child &&
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        React.cloneElement(child, {
          activeTab,
        })
    )}
  </Flex>
);

export { SimpleTabs, SimpleTab };
