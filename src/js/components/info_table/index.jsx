// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Tree from '../tree';
import lodashOmit from 'lodash/omit';

type InfoTableProps = {
  omit?: Array<string>,
  object: Object,
};

const InfoTable: Function = ({
  omit,
  object,
}: InfoTableProps): React.Element<any> => (
  <Tree data={omit ? lodashOmit(object, omit) : object} />
);

export default compose(onlyUpdateForKeys(['object', 'omit']))(InfoTable);
