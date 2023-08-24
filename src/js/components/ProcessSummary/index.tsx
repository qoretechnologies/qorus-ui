import { Tag } from '@blueprintjs/core';
import { isArray, size } from 'lodash';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import withProcessKill from '../../hocomponents/withProcessKill';
import Alert from '../alert';
import NoData from '../nodata';
import PaneItem from '../pane_item';

type Props = {
  model: any;
  handleKillClick: Function;
};

const ProcessSummary: Function = ({
  model: {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
    enabled,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'process' does not exist on type 'Object'... Remove this comment to see the full error message
    process: prcs,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'processes' does not exist on type 'Objec... Remove this comment to see the full error message
    processes,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'remote' does not exist on type 'Object'.
    remote,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'autostart' does not exist on type 'Objec... Remove this comment to see the full error message
    autostart,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'active' does not exist on type 'Object'.
    active,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'loaded' does not exist on type 'Object'.
    loaded,
    status,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'expiry_date' does not exist on type 'Obj... Remove this comment to see the full error message
    expiry_date: expiry,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobid' does not exist on type 'Object'.
    jobid,
    // @ts-ignore ts-migrate(1013) FIXME: A rest parameter or binding pattern may not have a... Remove this comment to see the full error message
    ...rest
  },
  handleKillClick,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Props'.
  type,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const processKey = type === 'service' ? processes : prcs;
  const processData = processKey ? (isArray(processKey) ? processKey : [processKey]) : null;

  if (enabled) {
    if (remote) {
      if (size(processData)) {
        return (
          <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
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
                {/* @ts-ignore ts-migrate(2322) FIXME: Type '"right "' is not assignable to type 'Float'. */}
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
          <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
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
          <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
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
          <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
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
          <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
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
        {type === 'service' && status === 'unloaded' ? (
          <Alert
            title={intl.formatMessage({ id: 'summary.service-not-loaded-title' })}
            bsStyle="warning"
          >
            <FormattedMessage id="summary.service-not-loaded" />
          </Alert>
        ) : (
          <NoData title={intl.formatMessage({ id: 'summary.running-in-core' })} />
        )}
      </PaneItem>
    );
  }

  return (
    <PaneItem title={intl.formatMessage({ id: 'summary.process-summary' })}>
      <Alert title={intl.formatMessage({ id: 'summary.not-running' })} bsStyle="danger">
        <FormattedMessage id="summary.interface-disabled" />
      </Alert>
    </PaneItem>
  );
};

export default compose(withProcessKill, injectIntl)(ProcessSummary);
