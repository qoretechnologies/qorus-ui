// @flow
import React from 'react';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import { Tr, Td } from '../../../components/new_table';
import Text from '../../../components/text';
import withDispatch from '../../../hocomponents/withDispatch';
import ConfirmDialog from '../../../components/confirm_dialog';
import { Controls, Control as Button } from '../../../components/controls';
import actions from '../../../store/api/actions';
import { hasPermission } from '../../../helpers/user';
import { IdColumn } from '../../../components/IdColumn';
import NameColumn from '../../../components/NameColumn';
import { DescriptionColumn } from '../../../components/DescriptionColumn';
import { ActionColumn } from '../../../components/ActionColumn';
import { injectIntl } from 'react-intl';

type Props = {
  slaid: number,
  name: string,
  description?: string,
  units?: string,
  openModal: Function,
  closeModal: Function,
  dispatchAction: Function,
  handleDeleteClick: Function,
  perms: Array<string>,
  first?: boolean,
};

const SLARow: Function = ({
  slaid,
  name,
  description,
  units,
  handleDeleteClick,
  perms,
  first,
  intl,
}: Props): React.Element<any> => (
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
          iconName="cross"
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
    handleDeleteClick: ({
      openModal,
      closeModal,
      slaid,
      dispatchAction,
      name,
      intl,
    }: Props): Function => (): void => {
      const handleConfirm: Function = (): void => {
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
