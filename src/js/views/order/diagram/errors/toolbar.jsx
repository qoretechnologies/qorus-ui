/* @flow */
import React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';

import Toolbar from '../../../../components/toolbar';
import Dropdown, {
  Control as DToggle,
  Item as DItem,
} from '../../../../components/dropdown';

type Props = {
  data: Array<Object>,
  onSubmit: Function,
  onShowDetailClick: Function,
  onCopyErrorClick: Function,
  onCSVClick: Function,
  showDetail: boolean,
};

export default function DiagramErrorsToolbar(props: Props) {
  return (
    <Toolbar mb>
      <Dropdown multi def="ALL" id="errors" onSubmit={props.onSubmit}>
        <DToggle />
        <DItem title="ALL" />
        <DItem title="FATAL" />
        <DItem title="MAJOR" />
        <DItem title="WARNING" />
        <DItem title="INFO" />
        <DItem title="NONE" />
      </Dropdown>{' '}
      <ButtonGroup>
        <Button
          text="Copy last error"
          icon="copy"
          onClick={props.onCopyErrorClick}
        />
        <Button text="CSV" icon="copy" onClick={props.onCSVClick} />
      </ButtonGroup>
    </Toolbar>
  );
}
