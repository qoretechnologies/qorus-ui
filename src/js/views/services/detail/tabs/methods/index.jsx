import React, { PropTypes } from 'react';
import MethodsTable from './table';

export default function MethodsTab(props) {
  return (
    <div>
      <div className="svc__methods">
        <MethodsTable
          service={props.service}
          methods={props.service.methods}
        />
      </div>
    </div>
  );
}

MethodsTab.propTypes = {
  service: PropTypes.object.isRequired,
};
