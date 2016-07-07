import React, { PropTypes } from 'react';
import DetailTable from './detail_table';
import Controls from './controls';

export default function GroupDetail(props) {
  return (
    <div>
      <div className="row">
        <div className="col-xs-11">
          <h2 className="detail-title">
            Group: { props.group.name }
          </h2>
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
