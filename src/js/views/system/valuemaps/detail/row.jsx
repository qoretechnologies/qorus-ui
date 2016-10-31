/* @flow */
import React from 'react';

import { Row, EditableCell, Td } from '../../../../components/table';
import { Controls, Control as Button } from '../../../../components/controls';

type Props = {
  data: Object,
  id: number,
  name: string,
  onUpdate: Function,
  onRemoveClick: Function,
}

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
    <Row>
      <Td className="name">{name}</Td>
      <EditableCell
        value={value}
        onSave={handleValueChange}
      />
      <Td>
        <Controls grouped>
          <Button
            icon="power-off"
            btnStyle={enabled ? 'success' : 'default'}
            onClick={handleEnableClick}
          />
          <Button
            icon="times"
            btnStyle="danger"
            onClick={handleRemoveClick}
          />
        </Controls>
      </Td>
    </Row>
  );
};

export default RowDetail;
