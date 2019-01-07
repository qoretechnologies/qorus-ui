import React from 'react';

import PaneItem from '../pane_item';
import { Tag } from '@blueprintjs/core';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import NoData from '../nodata';
import Alert from '../alert';
import compose from 'recompose/compose';
import withProcessKill from '../../hocomponents/withProcessKill';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';

type Props = {
  model: Object,
  handleKillClick: Function,
};

const ProcessSummary: Function = ({
  model: { enabled, process: prcs, remote, autostart },
  handleKillClick,
}: Props): React.Element<PaneItem> => {
  if (enabled) {
    if (remote) {
      if (prcs) {
        return (
          <PaneItem
            title="Process summary"
            label={
              <ButtonGroup>
                <Button
                  btnStyle="danger"
                  icon="cross"
                  onClick={() => {
                    handleKillClick(prcs.id);
                  }}
                >
                  Kill
                </Button>
              </ButtonGroup>
            }
          >
            <Tag> Node: {prcs.node}</Tag> <Tag> PID: {prcs.pid}</Tag>{' '}
            <Tag> Status: {prcs.status}</Tag>{' '}
            <Tag> Memory: {prcs.priv_str}</Tag>{' '}
          </PaneItem>
        );
      }

      // Service not running
      if (autostart === false) {
        return (
          <PaneItem title="Process summary">
            <Alert title="Process not running" bsStyle="warning">
              Autostart is disabled; to start the service automatically, set
              autostart to true
            </Alert>
          </PaneItem>
        );
      }

      // Workflow not running
      if (autostart === 0) {
        return (
          <PaneItem title="Process summary">
            <Alert title="Process not running" bsStyle="warning">
              Autostart is zero; to start the workflow automatically, set a
              positive autostart value
            </Alert>
          </PaneItem>
        );
      }

      // Autostart is non-existent or has positive value
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

export default compose(
  withProcessKill,
  onlyUpdateForKeys(['model'])
)(ProcessSummary);
