import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Controls from '../controls';

const Header: Function = ({ model }: Object) => (
  <div className="row pane__header">
    <div className="col-xs-12">
      <h3 className="pull-left">
        <span className="selectable">
          {model.normalizedName}
        </span>
        <p>
          <small>
            <em>{model.description}</em>
          </small>
        </p>
        <div>
          <Controls {...model} />
        </div>
      </h3>
    </div>
  </div>
);

export default pure(['model'])(Header);
