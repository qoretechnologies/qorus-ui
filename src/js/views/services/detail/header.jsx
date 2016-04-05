import React from 'react';
import ServicesControls from '../controls';

function ServicesHeader(props) {
  return (
    <div className="row svc__header">
      <div className="col-xs-12">
        <h3 className="pull-left">
          <span className="selectable">
            {props.service.normalizedName}
          </span>
        </h3>
      </div>
      <div className="col-xs-12 svc__controls">
        <ServicesControls service={props.service} />
      </div>
    </div>
  );
  // }
}

// ServicesHeader.contextTypes = { dispatch: React.PropTypes.func.isRequired };
ServicesHeader.propTypes = { service: React.PropTypes.object.isRequired };

export default ServicesHeader;
