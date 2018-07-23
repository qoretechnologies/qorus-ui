/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

import { Tr, Td } from '../../../../components/new_table';
import { Controls, Control } from '../../../../components/controls';
import Text from '../../../../components/text';

type Props = {
  model: Object,
  onEditClick: Function,
  handleEditClick: Function,
  onDeleteClick: Function,
  handleDeleteClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  first: boolean,
};

const PermsRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  canEdit,
  canDelete,
  first,
}: Props): React.Element<any> => (
  <Tr first={first}>
    <Td className="text normal">{model.permission_type}</Td>
    <Td className="name">
      <Text text={model.name} />
    </Td>
    <Td className="text">
      <Text text={model.desc} />
    </Td>
    <Td className="text narrow">
      <ButtonGroup>
        {canEdit &&
          model.permission_type !== 'SYSTEM' && (
            <Button
              icon="edit"
              onClick={handleEditClick}
              title="Edit permission"
              className="bp3-small"
            />
          )}
        {canDelete &&
          model.permission_type !== 'SYSTEM' && (
            <Button
              icon="cross"
              intent={Intent.DANGER}
              onClick={handleDeleteClick}
              title="Remove permission"
              className="bp3-small"
            />
          )}
      </ButtonGroup>
    </Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleEditClick: ({ model, onEditClick }: Props): Function => (): void => {
      onEditClick(model);
    },
    handleDeleteClick: ({
      model,
      onDeleteClick,
    }: Props): Function => (): void => {
      onDeleteClick(model.name);
    },
  }),
  pure(['model'])
)(PermsRow);
