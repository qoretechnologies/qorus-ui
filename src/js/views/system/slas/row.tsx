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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
    handleDeleteClick: ({
      openModal,
      closeModal,
      slaid,
      dispatchAction,
      name,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
      intl,
    }: Props): Function => (): void => {
      const handleConfirm: Function = (): void => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
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
