/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

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
}

const PermsRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  canEdit,
  canDelete,
}: Props): React.Element<any> => (
  <Tr>
    <Td className="narrow">
      <Controls grouped>
        { canEdit && model.permission_type !== 'SYSTEM' && (
          <Control
            icon="edit"
            btnStyle="warning"
            action={handleEditClick}
            title="Edit permission"
          />
        )}
        { canDelete && model.permission_type !== 'SYSTEM' && (
          <Control
            icon="close"
            btnStyle="danger"
            action={handleDeleteClick}
            title="Remove permission"
          />
        )}
      </Controls>
    </Td>
    <Td className="text normal">{ model.permission_type }</Td>
    <Td className="name">
      <Text text={model.name } />
    </Td>
    <Td className="text">
      <Text text={model.desc} />
    </Td>
  </Tr>
);


export default compose(
  withHandlers({
    handleEditClick: ({ model, onEditClick }: Props): Function => (): void => {
      onEditClick(model);
    },
    handleDeleteClick: ({ model, onDeleteClick }: Props): Function => (): void => {
      onDeleteClick(model.name);
    },
  }),
  pure(['model'])
)(PermsRow);
