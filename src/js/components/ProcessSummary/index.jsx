import { Tag } from '@blueprintjs/core';
import { isArray, size } from 'lodash';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import {
  Control as Button,
  Controls as ButtonGroup
} from '../../components/controls';
import withProcessKill from '../../hocomponents/withProcessKill';
import Alert from '../alert';
import NoData from '../nodata';
import PaneItem from '../pane_item';

type Props = {
  model: Object,
  handleKillClick: Function,
};

const ProcessSummary: Function = ({
  model: {
    enabled,
    process: prcs,
    processes,
    remote,
    autostart,
    active,
    loaded,
    expiry_date: expiry,
    jobid,
    ...rest,
  },
  handleKillClick,
  intl,
  type,
}: Props): React.Element<PaneItem> => {
  const processKey = type === 'service' ? processes : prcs;
  const processData = processKey ? isArray(processKey) ? processKey : [processKey] : null;

  if (enabled) {
    if (remote) {
      if (size(processData)) {
        return (
          <PaneItem
            title={intl.formatMessage({ id: 'summary.process-summary' })}
          >
            {processData.map((p) => (
              <div key={p.pid} style={{ clear: 'both' }}>
                <div style={{ float: 'left' }}>
                  <Tag>
                    {' '}
                    <FormattedMessage id="cluster.node" />: {p.node}
                  </Tag>{' '}
                  <Tag>
                    {' '}
                    <FormattedMessage id="cluster.pid" />: {p.pid}
                  </Tag>{' '}
                  <Tag>
                    {' '}
                    <FormattedMessage id="cluster.status" />: {p.status_string}
                  </Tag>{' '}
                  <Tag>
                    {' '}
                    <FormattedMessage id="cluster.memory" />: {p.priv_str}
                  </Tag>{' '}
                </div>
                <div style={{ float: 'right ' }}>
                  <ButtonGroup>
                    <Button
                      btnStyle="danger"
                      icon="cross"
                      onClick={() => {
                        handleKillClick(p.id);
                      }}
                    >
                      <FormattedMessage id="cluster.kill" />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            ))}
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
        {type === 'service' && !loaded ? (
          <Alert
            title={intl.formatMessage({ id: 'summary.service-not-loaded-title' })}
            bsStyle="warning"
          >
            <FormattedMessage id="summary.service-not-loaded" />
          </Alert>
        ) : (
          <NoData
            title={intl.formatMessage({ id: 'summary.running-in-core' })}
          />
        )}
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
