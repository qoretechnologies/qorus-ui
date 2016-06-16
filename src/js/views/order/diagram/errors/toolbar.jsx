import React, { PropTypes } from 'react';

import Toolbar from 'components/toolbar';

import { Controls, Control as Button } from 'components/controls';
import Dropdown, { Control as DToggle, Item as DItem } from 'components/dropdown';

export default function DiagramErrorsToolbar(props) {
  return (
    <Toolbar>
      <h4 className="pull-left">
        Errors
        <small> (Total: { props.data.length }) </small>
      </h4>
      <div className="error-toolbar pull-left">
        <Controls noControls grouped>
          <Dropdown
            multi
            def="ALL"
            id="errors"
            onSubmit={props.onSubmit}
          >
            <DToggle />
            <DItem title="ALL" />
            <DItem title="FATAL" />
            <DItem title="MAJOR" />
            <DItem title="WARNING" />
            <DItem title="INFO" />
            <DItem title="NONE" />
          </Dropdown>
          <Button
            label="Show errors detail"
            big
            btnStyle="default"
            icon={props.showDetail ? 'check-square-o' : 'square-o'}
            action={props.onShowDetailClick}
          />
          <Button
            label="Copy last error"
            big
            btnStyle="default"
            icon="copy"
            action={props.onCopyErrorClick}
          />
          <Button
            label="CSV"
            big
            btnStyle="default"
            icon="copy"
            action={props.onCSVClick}
          />
        </Controls>
      </div>
    </Toolbar>
  );
}

DiagramErrorsToolbar.propTypes = {
  data: PropTypes.array,
  onSubmit: PropTypes.func,
  onShowDetailClick: PropTypes.func,
  onCopyErrorClick: PropTypes.func,
  onCSVClick: PropTypes.func,
  showDetail: PropTypes.bool,
};
