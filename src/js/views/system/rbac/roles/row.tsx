/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Button, Intent, ButtonGroup } from '@blueprintjs/core';

import { Tr, Td } from '../../../../components/new_table';
import Text from '../../../../components/text';
import NameColumn from '../../../../components/NameColumn';
import { DescriptionColumn } from '../../../../components/DescriptionColumn';
import { ActionColumn } from '../../../../components/ActionColumn';

type Props = {
  model: Object,
  onEditClick: Function,
  onDeleteClick: Function,
  onCloneClick: Function,
  handleEditClick: Function,
  handleDeleteClick: Function,
  handleCloneClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  canCreate: boolean,
  first: boolean,
};

const RolesRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  handleCloneClick,
  canEdit,
  canDelete,
  canCreate,
  first,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Tr first={first}>
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Object'.
    <NameColumn name={model.role} />
    <ActionColumn className="medium">
      <ButtonGroup>
        {canCreate && (
          <Button
            icon="duplicate"
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
            onClick={handleCloneClick}
            title="Duplicate role"
            className="bp3-small"
          />
        )}
        {canEdit && (
          <Button
            icon="edit"
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
            onClick={handleEditClick}
            title="Edit role"
            className="bp3-small"
          />
        )}
        {canDelete && (
          <Button
            icon="cross"
            intent={Intent.DANGER}
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
            onClick={handleDeleteClick}
            title="Remove role"
            className="bp3-small"
          />
        )}
      </ButtonGroup>
    </ActionColumn>
    <Td className="text">
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'provider' does not exist on type 'Object... Remove this comment to see the full error message
      <Text text={model.provider} />
    </Td>
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
    <DescriptionColumn>{model.desc}</DescriptionColumn>
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Object'.
      onDeleteClick(model.role);
    },
    handleCloneClick: ({
      model,
      onCloneClick,
    }: Props): Function => (): void => {
      onCloneClick(model);
    },
  }),
  pure(['model', 'canEdit', 'canDelete', 'canCreate'])
)(RolesRow);
