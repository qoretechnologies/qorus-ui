// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumn } from '../../../components/ActionColumn';
import ConfirmDialog from '../../../components/confirm_dialog';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls } from '../../../components/controls';
import { DescriptionColumn } from '../../../components/DescriptionColumn';
import { IdColumn } from '../../../components/IdColumn';
import NameColumn from '../../../components/NameColumn';
import { Td, Tr } from '../../../components/new_table';
import Text from '../../../components/text';
import { hasPermission } from '../../../helpers/user';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';

type Props = {
  slaid: number;
  name: string;
  description?: string;
  units?: string;
  openModal: Function;
  closeModal: Function;
  dispatchAction: Function;
  handleDeleteClick: Function;
  perms: Array<string>;
  first?: boolean;
};

const SLARow: Function = ({
  slaid,
  name,
  description,
  units,
  handleDeleteClick,
  perms,
  first,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Tr key={slaid} first={first}>
    <IdColumn>{slaid}</IdColumn>
    <NameColumn name={name} link={`/sla/${slaid}`} type="sla" />
    <DescriptionColumn>{description}</DescriptionColumn>
    <Td className="text">
      <Text text={units} />
    </Td>
    <ActionColumn>
      <Controls grouped>
        <Button
          title={intl.formatMessage({ id: 'button.delete' })}
          disabled={!hasPermission(perms, ['DELETE-SLA', 'SLA-CONTROL'], 'or')}
          icon="cross"
          btnStyle="danger"
          onClick={handleDeleteClick}
        />
      </Controls>
    </ActionColumn>
  </Tr>
);

export default compose(
  withDispatch(),
  injectIntl,
  withHandlers({
    handleDeleteClick:
      ({
        openModal,
        closeModal,
        slaid,
        dispatchAction,
        name,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
        intl,
      }: Props): Function =>
      (): void => {
        const handleConfirm: Function = (): void => {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
          dispatchAction(actions.slas.remove, slaid);
          closeModal();
        };

        openModal(
          <ConfirmDialog onClose={closeModal} onConfirm={handleConfirm}>
            {intl.formatMessage({ id: 'dialog.are-you-sure-remove-sla' }, { name: name })}
          </ConfirmDialog>
        );
      },
  }),
  pure(['slaid', 'name', 'description', 'units'])
)(SLARow);
