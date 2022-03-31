// @flow
import lodashOmit from 'lodash/omit';
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Tree from '../tree';

type InfoTableProps = {
  omit?: Array<string>;
  object: any;
};

const InfoTable: Function = ({
  omit,
  object,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
InfoTableProps) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Tree data={omit ? lodashOmit(object, omit) : any} {...rest} contentInline />
);

export default compose(onlyUpdateForKeys(['object', 'omit']))(InfoTable);
