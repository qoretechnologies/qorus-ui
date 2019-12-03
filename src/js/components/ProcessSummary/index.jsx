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
import moment from 'moment';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  model: Object,
  handleKillClick: Function,
};

const ProcessSummary: Function = ({
  model: {
    enabled,
    process: prcs,
    remote,
    autostart,
    active,
    expiry_date: expiry,
    jobid,
  },
  handleKillClick,
  intl,
}: Props): React.Element<PaneItem> => {
  if (enabled) {
    if (remote) {
      if (prcs) {
        return (
          <PaneItem
            title={intl.formatMessage({ id: 'summary.process-summary' })}
            label={
              <ButtonGroup>
                <Button
                  btnStyle="danger"
                  iconName="cross"
                  onClick={() => {
                    handleKillClick(prcs.id);
                  }}
                >
                  <FormattedMessage id="cluster.kill" />
                </Button>
              </ButtonGroup>
            }
          >
            <Tag>
              {' '}
              <FormattedMessage id="cluster.node" />: {prcs.node}
            </Tag>{' '}
            <Tag>
              {' '}
              <FormattedMessage id="cluster.pid" />: {prcs.pid}
            </Tag>{' '}
            <Tag>
              {' '}
              <FormattedMessage id="cluster.status" />: {prcs.status_string}
            </Tag>{' '}
            <Tag>
              {' '}
              <FormattedMessage id="cluster.memory" />: {prcs.priv_str}
            </Tag>{' '}
          </PaneItem>
        );
      }

      // Service not running
      if (autostart === false) {
        return (
          <PaneItem
            title={intl.formatMessage({ id: 'summary.process-summary' })}
          >
            <Alert
              title={intl.formatMessage({ id: 'summary.process-not-running' })}
              bsStyle="warning"
            >
              <FormattedMessage id="summary.autostart-disabled" />
            </Alert>
          </PaneItem>
        );
      }

      // Workflow not running
      if (autostart === 0) {
        return (
          <PaneItem
            title={intl.formatMessage({ id: 'summary.process-summary' })}
          >
            <Alert
              title={intl.formatMessage({ id: 'summary.process-not-running' })}
              bsStyle="warning"
            >
              <FormattedMessage id="summary.autostart-zero" />
            </Alert>
          </PaneItem>
        );
      }

      // Job not active
      if (jobid && !active) {
        return (
          <PaneItem
            title={intl.formatMessage({ id: 'summary.process-summary' })}
          >
            <Alert
              title={intl.formatMessage({ id: 'summary.process-not-running' })}
              bsStyle="warning"
            >
              <FormattedMessage id="summary.job-not-active" />
            </Alert>
          </PaneItem>
        );
      }

      // Job expired
      if (jobid && moment(expiry).isBefore(moment())) {
        return (
          <PaneItem
            title={intl.formatMessage({ id: 'summary.process-summary' })}
          >
            <Alert
              title={intl.formatMessage({ id: 'summary.process-not-running' })}
              bsStyle="warning"
            >
              <FormattedMessage id="summary.job-expired" />
            </Alert>
          </PaneItem>
        );
      }

      // Autostart is non-existent or has positive value
      return (
        <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
          <Alert
            title={intl.formatMessage({ id: 'summary.process-not-running' })}
            bsStyle="warning"
          >
            <FormattedMessage id="summary.check-log-details" />
          </Alert>
        </PaneItem>
      );
    }

    return (
      <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
        <NoData title={intl.formatMessage({ id: 'summary.running-in-core' })} />
      </PaneItem>
    );
  }

  return (
    <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
      <Alert
        title={intl.formatMessage({ id: 'summary.not-running' })}
        bsStyle="danger"
      >
        <FormattedMessage id="summary.interface-disabled" />
      </Alert>
    </PaneItem>
  );
};

export default compose(
  withProcessKill,
  onlyUpdateForKeys(['model']),
  injectIntl
)(ProcessSummary);
