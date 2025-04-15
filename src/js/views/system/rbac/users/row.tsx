/* @flow */
import { Button, ButtonGroup, Intent } from '@blueprintjs/core';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumn } from '../../../../components/ActionColumn';
import Badge from '../../../../components/badge';
import NameColumn from '../../../../components/NameColumn';
import { Td, Tr } from '../../../../components/new_table';
import Text from '../../../../components/text';

type Props = {
  model: any;
  canEdit: boolean;
  onEditClick: Function;
  handleEditClick: Function;
  canDelete: boolean;
  onDeleteClick: Function;
  handleDeleteClick: Function;
  first: boolean;
};

const UsersRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  canEdit,
  canDelete,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Tr first={first}>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
    <NameColumn name={model.name} />
    <ActionColumn>
      <ButtonGroup>
        <Button
          disabled={!canEdit}
          icon="edit"
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
          onClick={handleEditClick}
          title="Edit user"
          className="bp3-small"
        />
        <Button
          disabled={!canDelete}
          icon="cross"
          intent={Intent.DANGER}
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
          onClick={handleDeleteClick}
          title="Remove user"
          className="bp3-small"
        />
      </ButtonGroup>
    </ActionColumn>
    <Td className="text">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message */}
      <Text text={model.username} />
    </Td>
    <Td className="text">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type 'Object'. */}
      {model.roles?.map((role, index) => (
        <Badge key={index} val={role} label="info" />
      ))}
    </Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleEditClick:
      ({ model, onEditClick }: Props): Function =>
      (): void => {
        onEditClick(model);
      },
    handleDeleteClick:
      ({ model, onDeleteClick }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message
        onDeleteClick(model.username);
      },
  }),
  pure(['model'])
)(UsersRow);
