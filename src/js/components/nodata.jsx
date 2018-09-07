// @flow
import React from 'react';
import { Callout } from '@blueprintjs/core';

type Props = {
  title: string,
};

const NoData: Function = ({
  title: title = 'No data',
}: Props): React.Element<any> => (
  <Callout iconName="warning-sign" title={title} />
);

export default NoData;
