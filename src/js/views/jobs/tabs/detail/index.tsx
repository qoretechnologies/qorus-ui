/* @flow */
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { createSelector } from 'reselect';
import AlertsTable from '../../../../components/alerts_table';
import Box from '../../../../components/box';
import Flex from '../../../../components/Flex';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/gr... Remove this comment to see the full error message
import { Group, Groups } from '../../../../components/groups';
import InfoHeader from '../../../../components/InfoHeader';
import PaneItem from '../../../../components/pane_item';
import ProcessSummary from '../../../../components/ProcessSummary';
import ScheduleText from '../../../../components/ScheduleText';
import SLAControl from '../../../../components/sla_control';
import { hasPermission } from '../../../../helpers/user';
import sync from '../../../../hocomponents/sync';
import withDispatch from '../../../../hocomponents/withDispatch';
import { resourceSelector } from '../../../../selectors';
import actions from '../../../../store/api/actions';
import JobControls from '../../controls';
import Options from './options';

type Props = {
  model: Object,
  handleSetSLAChange: Function,
  handleRemoveSLAChange: Function,
  perms: Object,
  slas: Array<Object>,
  isTablet: boolean,
};

const DetailTab = ({
  model,
  isTablet,
  handleSetSLAChange,
  handleRemoveSLAChange,
  perms,
  slas,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: Props) => (
  <Box top fill>
    <InfoHeader model={model} />
    <Flex scrollY>
      <PaneItem title={intl.formatMessage({ id: 'component.controls' })}>
        <JobControls
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
          enabled={model.enabled}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'active' does not exist on type 'Object'.
          active={model.active}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          id={model.id}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'minute' does not exist on type 'Object'.
          minute={model.minute}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'hour' does not exist on type 'Object'.
          hour={model.hour}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'day' does not exist on type 'Object'.
          day={model.day}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'month' does not exist on type 'Object'.
          month={model.month}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'wday' does not exist on type 'Object'.
          week={model.wday}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'remote' does not exist on type 'Object'.
          remote={model.remote}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'expiry_date' does not exist on type 'Obj... Remove this comment to see the full error message
          expiry={model.expiry_date}
        />
      </PaneItem>
      <PaneItem title={intl.formatMessage({ id: 'component.schedule' })}>
        <ScheduleText
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'minute' does not exist on type 'Object'.
          cron={`${model.minute} ${model.hour} ${model.day} ${model.month} ${model.wday}`}
        />
      </PaneItem>
      <PaneItem title={intl.formatMessage({ id: 'component.sla' })}>
        <SLAControl
          model={model}
          setSla={handleSetSLAChange}
          removeSla={handleRemoveSLAChange}
          slas={slas}
          canModify={hasPermission(perms, ['MODIFY-SLA', 'SLA-CONTROL'], 'or')}
          type="job"
        />
      </PaneItem>
      <ProcessSummary model={model} type="job" />
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'alerts' does not exist on type 'Object'.
      <AlertsTable alerts={model.alerts} />
      <Groups>
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type 'Object'.
        {(model.groups || []).map((g) => (
          <Group
            key={g.name}
            name={g.name}
            url={`/groups?group=${g.name}`}
            size={g.size}
            disabled={!g.enabled}
          />
        ))}
      </Groups>
      <Options model={model} />
    </Flex>
  </Box>
);

const viewSelector = createSelector(
  [resourceSelector('slas'), resourceSelector('currentUser')],
  (meta, user) => ({
    meta,
    slas: meta.data,
    perms: user.data.permissions,
  })
);

export default compose(
  connect(viewSelector, {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
    load: actions.slas.fetch,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    removeSla: actions.jobs.removeSLAJob,
  }),
  withDispatch(),
  withHandlers({
    handleSetSLAChange: ({ dispatchAction }): Function => (
      name: string,
      value: string
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
      dispatchAction(actions.jobs.setSLAJob, name, value);
    },
    handleRemoveSLAChange: ({ dispatchAction }): Function => (
      name: string,
      value: string
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
      dispatchAction(actions.jobs.removeSLAJob, name, value);
    },
  }),
  sync('meta'),
  pure(['model', 'isTablet']),
  injectIntl
)(DetailTab);
