/* @flow */
import React from 'react';
import pure from 'recompose/compose';

import Options from './options';
import JobControls from '../../controls';
import { Groups, Group } from '../../../../components/groups';
import AlertsTable from '../../../../components/alerts_table';
import Date from '../../../../components/date';

const DetailTab = ({ model, isTablet }: Object) => (
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

export default pure(DetailTab);
