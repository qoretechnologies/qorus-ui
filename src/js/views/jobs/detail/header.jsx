import React from 'react';
// import ServicesControls from '../controls';

function Header(props) {
  return (
    <div className="row pane__header">
      <div className="col-xs-12">
        <h3 className="pull-left">
          <span className="selectable">
            {props.model.normalizedName}
          </span>
        </h3>
      </div>
      <div className="col-xs-12 pane__controls">
        Controls
      </div>
    </div>
  );
  // }
}

// ServicesHeader.contextTypes = { dispatch: React.PropTypes.func.isRequired };
Header.propTypes = { model: React.PropTypes.object.isRequired };

export default Header;
