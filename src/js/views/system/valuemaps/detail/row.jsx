/* @flow */
import React from 'react';

import { Tr, EditableCell, Td } from '../../../../components/new_table';
import { Controls, Control as Button } from '../../../../components/controls';
import {
  updateValue,
  deleteValue,
} from '../../../../store/api/resources/valuemaps/actions';
import withDispatch from '../../../../hocomponents/withDispatch';

type Props = {
  data: Object,
  id: number,
  name: string,
  dispatchAction: Function,
};

const RowDetail: Function = ({
  data: { value, enabled },
  id,
  name,
  dispatchAction,
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
    <Tr>
      <Td className="name">{name}</Td>
      <EditableCell value={value} onSave={handleValueChange} />
      <Td>
        <Controls grouped>
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
        </Controls>
      </Td>
    </Tr>
  );
};

export default withDispatch()(RowDetail);
