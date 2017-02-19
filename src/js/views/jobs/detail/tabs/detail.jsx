/* @flow */
import React from 'react';
import pure from 'recompose/compose';

import Options from './options';
import JobControls from '../../controls';
import { Groups, Group } from '../../../../components/groups';
import AlertsTable from '../../../../components/alerts_table';

const DetailTab = ({ model }: { model: Object }) => (
  <div>
    <div>
      <h4> Schedule </h4>
      <JobControls
        scheduleOnly
        id={model.id}
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
            url={`/groups/${g.name}`}
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
