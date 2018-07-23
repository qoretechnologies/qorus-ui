// @flow
import React from 'react';
import { Callout } from '@blueprintjs/core';

type Props = {};

const NoData: Function = ({ }: Props): React.Element<any> => (
  <Callout icon="warning-sign" title="No data" />
);

export default NoData;
