/* @flow */
import React from 'react';

import { Tr, EditableCell, Td } from '../../../../components/new_table';
import { Controls, Control as Button } from '../../../../components/controls';

type Props = {
  data: Object,
  id: number,
  name: string,
  onUpdate: Function,
  onRemoveClick: Function,
};

const RowDetail: Function = ({
  data: { value, enabled },
  id,
  name,
  onUpdate,
  onRemoveClick,
}: Props): React.Element<any> => {
  const handleEnableClick: Function = (): void => {
    onUpdate(id, name, value, !enabled);
  };

  const handleValueChange = (newValue: string | number): void => {
    onUpdate(id, name, newValue, enabled);
  };

  const handleRemoveClick: Function = (): void => {
    onRemoveClick(id, name);
  };

  return (
    <Tr>
      <Td className="name">{name}</Td>
      <EditableCell value={value} onSave={handleValueChange} />
      <Td>
        // TODO: Fix the button icons
        <Controls grouped>
          <Button
            iconName="power-off"
            btnStyle={enabled ? 'success' : 'danger'}
            onClick={handleEnableClick}
            title={enabled ? 'Disable' : 'Enable'}
          />
          <Button
            iconName="times"
            btnStyle="danger"
            onClick={handleRemoveClick}
            title="Remove value"
          />
        </Controls>
      </Td>
    </Tr>
  );
};

export default RowDetail;
