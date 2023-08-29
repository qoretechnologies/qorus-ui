/* @flow */
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import React from 'react';

type Props = {
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  children: Array<React.Element<any>>;
  marginRight?: number;
};

/**
 * Container component for {@link Control} components.
 *
 * It allows overriding of child components props via its own
 * `controls` prop. This prop is an array of props objects in the same
 * order as child components.
 */
const Controls: Function = ({
  children,
  marginRight,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'className' does not exist on type 'Props... Remove this comment to see the full error message
  className,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ReqoreControlGroup className={className} style={{ marginRight }} {...rest}>
    {children}
  </ReqoreControlGroup>
);

export default Controls as any as any;
