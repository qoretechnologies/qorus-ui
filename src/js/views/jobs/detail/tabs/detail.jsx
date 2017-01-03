/* @flow */
import React from 'react';
import pure from 'recompose/compose';

import Options from './options';
import { Groups, Group } from '../../../../components/groups';
import AlertsTable from '../../../../components/alerts_table';

const DetailTab = ({ model }: { model: Object }) => (
  <div>
    <div className="svc__desc">
      <p className="text-muted">
        <em>{model.description}</em>
      </p>
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
