import React from 'react';

const Header: Function = ({ model }: Object) => (
  <div className="row pane__header">
    <div className="col-xs-12">
      <h3 className="pull-left">
        <span className="selectable">
          {model.normalizedName}
        </span>
      </h3>
      <div className="svc__desc pull-left">
        <p className="text-muted">
          <em>{model.description}</em>
        </p>
      </div>
    </div>
  </div>
);

export default Header;
