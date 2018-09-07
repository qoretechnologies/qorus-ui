import React from 'react';

import PaneItem from '../pane_item';
import { Tag } from '@blueprintjs/core';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import NoData from '../nodata';

type Props = {
  process: Object,
};

const ProcessSummary: Function = ({
  process,
}: Props): React.Element<PaneItem> =>
  process ? (
    <PaneItem title="Process summary">
      <Tag> Node: {process.node}</Tag> <Tag> PID: {process.pid}</Tag>{' '}
      <Tag> Status: {process.status}</Tag>{' '}
      <Tag> Memory: {process.priv_str}</Tag>{' '}
    </PaneItem>
  ) : (
    <PaneItem title="Process summary">
      <NoData title="Running locally in qorus-core" />
    </PaneItem>
  );

export default onlyUpdateForKeys(['process'])(ProcessSummary);
