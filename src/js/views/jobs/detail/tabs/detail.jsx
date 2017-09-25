/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Options from './options';
import JobControls from '../../controls';
import { Groups, Group } from '../../../../components/groups';
import AlertsTable from '../../../../components/alerts_table';
import Date from '../../../../components/date';
import SLAControl from '../../../../components/sla_control';
import { resourceSelector } from '../../../../selectors';
import sync from '../../../../hocomponents/sync';
import actions from '../../../../store/api/actions';
import { hasPermission } from '../../../../helpers/user';

type Props = {
  model: Object,
  setSla: Function,
  removeSla: Function,
  perms: Object,
  slas: Array<Object>,
  isTablet: boolean,
}

const DetailTab = ({
  model,
  isTablet,
  setSla,
  removeSla,
  perms,
  slas,
}: Props) => (
  <div>
    <div>
      {(isTablet && model.expiry_date) && (
        <div>
          <h4> Expiry date </h4>
          <Date date={model.expiry_date} />
        </div>
      )}
      <h4> Schedule </h4>
      <JobControls
        scheduleOnly
        id={model.id}
        schedText={model.sched_txt}
        minute={model.minute}
        hour={model.hour}
        day={model.day}
        month={model.month}
        week={model.wday}
      />
    </div>
    <div>
      <h4> SLA </h4>
      <SLAControl
        model={model}
        setSla={setSla}
        removeSla={removeSla}
        slas={slas}
        canModify={hasPermission(perms, ['MODIFY-SLA', 'SLA-CONTROL'], 'or')}
        type="job"
      />
    </div>
    <AlertsTable alerts={model.alerts} />
    <Groups>
      {
        (model.groups || []).map(g => (
          <Group
            key={g.name}
            name={g.name}
            url={`/groups?group=${g.name}`}
            size={g.size}
            disabled={!g.enabled}
          />
        ))
      }
    </Groups>
    <Options model={model} />
  </div>
);

const viewSelector = createSelector(
  [
    resourceSelector('slas'),
    resourceSelector('currentUser'),
  ], (meta, user) => ({
    meta,
    slas: meta.data,
    perms: user.data.permissions,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.slas.fetch,
      setSla: actions.jobs.setSLAJob,
      removeSla: actions.jobs.removeSLAJob,
    }
  ),
  sync('meta'),
  pure([
    'model',
    'isTablet',
  ])
)(DetailTab);
