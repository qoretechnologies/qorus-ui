// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import DetailTable from './table';
import Controls from '../controls';
import Icon from '../../../components/icon';
import withBack from '../../../hocomponents/withBackHandler';

type Props = {
  onBackClick: Function,
  id: number,
  name: string,
  description: string,
  services: Array<Object>,
  workflows: Array<Object>,
  jobs: Array<Object>,
  roles: Array<Object>,
  mappers: Array<Object>,
  vmaps: Array<Object>,
  enabled: boolean,
};

const GroupDetail: Function = ({
  onBackClick,
  id,
  name,
  description,
  services,
  workflows,
  jobs,
  roles,
  mappers,
  vmaps,
  enabled,
}: Props): React.Element<any> => (
  <div>
    <div className="row">
      <div className="col-xs-11">
        <h3 className="detail-title">
          <a onClick={onBackClick}>
            <Icon icon="angle-left" tooltip="Back to groups" />
          </a>
          {' '}
          { name }
          {' '}
          <small>({ id })</small>
        </h3>
        <small>{ description }</small>
      </div>
      <div className="col-xs-1 group-detail-controls">
        <div className="pull-right">
          <Controls
            enabled={enabled}
            name={name}
          />
        </div>
      </div>
    </div>
    <div className="row">
      <DetailTable
        data={services}
        columns={['Type', 'Name', 'Version', 'Autostart']}
        type="Services"
      />
      <DetailTable
        data={workflows}
        columns={['Name', 'Version']}
        type="Workflows"
      />
      <DetailTable
        data={jobs}
        columns={['Name', 'Version']}
        type="Jobs"
      />
    </div>
    <div className="row">
      <DetailTable
        data={roles}
        columns={['Name']}
        type="Roles"
      />
      <DetailTable
        data={mappers}
        columns={['Name', 'Version', 'Type']}
        type="Mappers"
      />
      <DetailTable
        data={vmaps}
        columns={['Name']}
        type="Vmaps"
      />
    </div>
  </div>
);


export default compose(
  withBack(),
  pure(['enabled']),
)(GroupDetail);
