import React from 'react';

import PaneItem from '../pane_item';
import { Tag } from '@blueprintjs/core';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import NoData from '../nodata';
import Alert from '../alert';

type Props = {
  model: Object,
};

const ProcessSummary: Function = ({
  model: { enabled, process, remote },
}: Props): React.Element<PaneItem> => {
  if (enabled) {
    if (remote) {
      if (process) {
        return (
          <PaneItem title="Process summary">
            <Tag> Node: {process.node}</Tag> <Tag> PID: {process.pid}</Tag>{' '}
            <Tag> Status: {process.status}</Tag>{' '}
            <Tag> Memory: {process.priv_str}</Tag>{' '}
          </PaneItem>
        );
      }

      return (
        <PaneItem title="Process summary">
          <Alert title="Process not running" bsStyle="warning">
            Check log for details
          </Alert>
        </PaneItem>
      );
    }

    return (
      <PaneItem title="Process summary">
        <NoData title="Running locally in qorus-core" />
      </PaneItem>
    );
  }

  return (
    <PaneItem title="Process summary">
      <Alert title="Not running" bsStyle="danger">
        Interface disabled
      </Alert>
    </PaneItem>
  );
};

export default onlyUpdateForKeys(['model'])(ProcessSummary);
