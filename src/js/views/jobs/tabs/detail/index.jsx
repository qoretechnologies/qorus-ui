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
  intl,
}: Props) => (
  <Box top fill>
    <InfoHeader model={model} />
    <Flex scrollY>
      <PaneItem title={intl.formatMessage({ id: 'component.controls' })}>
        <JobControls
          enabled={model.enabled}
          active={model.active}
          id={model.id}
          minute={model.minute}
          hour={model.hour}
          day={model.day}
          month={model.month}
          week={model.wday}
          remote={model.remote}
          expiry={model.expiry_date}
        />
      </PaneItem>
      <PaneItem title={intl.formatMessage({ id: 'component.schedule' })}>
        <ScheduleText
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
      <AlertsTable alerts={model.alerts} />
      <Groups>
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
    load: actions.slas.fetch,
    removeSla: actions.jobs.removeSLAJob,
  }),
  withDispatch(),
  withHandlers({
    handleSetSLAChange: ({ dispatchAction }): Function => (
      name: string,
      value: string
    ): void => {
      dispatchAction(actions.jobs.setSLAJob, name, value);
    },
    handleRemoveSLAChange: ({ dispatchAction }): Function => (
      name: string,
      value: string
    ): void => {
      dispatchAction(actions.jobs.removeSLAJob, name, value);
    },
  }),
  sync('meta'),
  pure(['model', 'isTablet']),
  injectIntl
)(DetailTab);
