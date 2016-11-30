import React, { PropTypes } from 'react';

import DetailTable from './detail_table';
import Controls from './controls';
import Icon from '../../components/icon';

export default function GroupDetail(props) {
  const handleBackClick = (e) => {
    e.preventDefault();

    history.go(-1);
  };

  return (
    <div>
      <div className="row">
        <div className="col-xs-11">
          <h3 className="detail-title">
            <a onClick={handleBackClick}>
              <Icon icon="angle-left" tooltip="Back to groups" />
            </a>
            {' '}
            { props.group.name }
            {' '}
            <small>({ props.group.id })</small>
          </h3>
          <small>{ props.group.description }</small>
        </div>
        <div className="col-xs-1 group-detail-controls">
          <div className="pull-right">
            <Controls group={props.group} />
          </div>
        </div>
      </div>
      <div className="row">
        <DetailTable
          data={props.group.services}
          columns={['Type', 'Name', 'Version', 'Autostart']}
          type="Services"
        />
        <DetailTable
          data={props.group.workflows}
          columns={['Name', 'Version']}
          type="Workflows"
        />
        <DetailTable
          data={props.group.jobs}
          columns={['Name', 'Version']}
          type="Jobs"
        />
      </div>
      <div className="row">
        <DetailTable
          data={props.group.roles}
          columns={['Name']}
          type="Roles"
        />
        <DetailTable
          data={props.group.mappers}
          columns={['Name', 'Version', 'Type']}
          type="Mappers"
        />
        <DetailTable
          data={props.group.vmaps}
          columns={['Name']}
          type="Vmaps"
        />
      </div>
    </div>
  );
}

GroupDetail.propTypes = {
  group: PropTypes.object,
};
