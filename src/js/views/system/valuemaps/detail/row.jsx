/* @flow */
import React from 'react';

import { Tr, EditableCell } from '../../../../components/new_table';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../../components/controls';
import {
  updateValue,
  deleteValue,
} from '../../../../store/api/resources/valuemaps/actions';
import withDispatch from '../../../../hocomponents/withDispatch';
import NameColumn from '../../../../components/NameColumn';
import { ActionColumn } from '../../../../components/ActionColumn';

type Props = {
  data: Object,
  id: number,
  name: string,
  dispatchAction: Function,
  first: boolean,
};

const RowDetail: Function = ({
  data: { value, enabled },
  id,
  name,
  dispatchAction,
  first,
}: Props): React.Element<any> => {
  const handleEnableClick: Function = (): void => {
    dispatchAction(updateValue, id, name, value, !enabled);
  };

  const handleValueChange = (newValue: string | number): void => {
    dispatchAction(updateValue, id, name, newValue, enabled);
  };

  const handleRemoveClick: Function = (): void => {
    dispatchAction(deleteValue, id, name);
  };

  return (
    <Tr first={first}>
      <NameColumn name={name} />
      <ActionColumn>
        <ButtonGroup>
          <Button
            iconName="power"
            btnStyle={enabled ? 'success' : 'danger'}
            onClick={handleEnableClick}
            title={enabled ? 'Disable' : 'Enable'}
          />
          <Button
            iconName="cross"
            btnStyle="danger"
            onClick={handleRemoveClick}
            title="Remove value"
          />
        </ButtonGroup>
      </ActionColumn>
      <EditableCell value={value} onSave={handleValueChange} />
    </Tr>
  );
};

export default withDispatch()(RowDetail);
