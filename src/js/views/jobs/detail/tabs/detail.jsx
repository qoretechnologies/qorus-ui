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
import Author from '../../../../components/author';
import { resourceSelector } from '../../../../selectors';
import sync from '../../../../hocomponents/sync';
import actions from '../../../../store/api/actions';
import { hasPermission } from '../../../../helpers/user';
import PaneItem from '../../../../components/pane_item';

type Props = {
  model: Object,
  setSla: Function,
  removeSla: Function,
  perms: Object,
  slas: Array<Object>,
  isTablet: boolean,
};

const DetailTab = ({
  model,
  isTablet,
  setSla,
  removeSla,
  perms,
  slas,
}: Props) => (
  <div>
    <Author model={model} />
    {isTablet &&
      model.expiry_date && (
        <PaneItem title="Expiry date">
          <Date date={model.expiry_date} />
        </PaneItem>
      )}
    <PaneItem title="Schedule">
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
    </PaneItem>
    <PaneItem title="SLA">
      <SLAControl
        model={model}
        setSla={setSla}
        removeSla={removeSla}
        slas={slas}
        canModify={hasPermission(perms, ['MODIFY-SLA', 'SLA-CONTROL'], 'or')}
        type="job"
      />
    </PaneItem>
    <AlertsTable alerts={model.alerts} />
    <Groups>
      {(model.groups || []).map(g => (
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
  </div>
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
  connect(
    viewSelector,
    {
      load: actions.slas.fetch,
      setSla: actions.jobs.setSLAJob,
      removeSla: actions.jobs.removeSLAJob,
    }
  ),
  sync('meta'),
  pure(['model', 'isTablet'])
)(DetailTab);
