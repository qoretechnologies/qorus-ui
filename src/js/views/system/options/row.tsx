// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import { Tag, Icon, Intent } from '@blueprintjs/core';

import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../components/controls';
import { Tr, Td } from '../../../components/new_table';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';
import OptionModal from './modal';
import Text from '../../../components/text';
import NameColumn from '../../../components/NameColumn';
import { hasPermission } from '../../../helpers/user';
import { typeToString } from '../../../helpers/system';
import withDispatch from '../../../hocomponents/withDispatch';

type Props = {
  dispatchAction: Function,
  handleEditClick: Function,
  handleOptionSave: Function,
  name: string,
  status: string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  workflow: ?string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  service: ?string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  job: ?string,
  default?: any,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  def: ?any,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  value: ?any,
  openModal: Function,
  closeModal: Function,
  permissions: Array<string>,
  canEdit: boolean,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  stringDef: ?any,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  stringVal: ?any,
  first: boolean,
};

const OptionRow: Function = ({
  status,
  name,
  workflow,
  service,
  job,
  stringDef,
  stringVal,
  handleEditClick,
  canEdit,
  first,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Tr first={first}>
    <Td className="narrow">
      {status === 'locked' && (
        <Icon
          title="This option is locked and cannot be changed while Qorus is running"
          icon="lock"
        />
      )}
    </Td>
    <NameColumn name={name} />
    <Td className="big">
      <Tag
        title={workflow ? 'Affecting Workflows' : ''}
        className="bp3-minimal bp3-round"
        intent={workflow ? Intent.PRIMARY : Intent.NONE}
      >
        W
      </Tag>{' '}
      <Tag
        title={service ? 'Affecting Services' : ''}
        className="bp3-minimal bp3-round"
        intent={service ? Intent.PRIMARY : Intent.NONE}
      >
        S
      </Tag>{' '}
      <Tag
        title={job ? 'Affecting Jobs' : ''}
        className="bp3-minimal bp3-round"
        intent={job ? Intent.PRIMARY : Intent.NONE}
      >
        J
      </Tag>
    </Td>
    <Td className="text">
      <Text text={stringDef} renderTree />
    </Td>
    <Td className="text">
      <Text text={stringVal} renderTree />
    </Td>
    <Td className="tiny">
      {canEdit && (
        <ButtonGroup>
          <Button
            title="Edit this option"
            icon="edit"
            onClick={handleEditClick}
            className="bp3-small"
          />
        </ButtonGroup>
      )}
    </Td>
  </Tr>
);

export default compose(
  connect(
    (state: Object): Object => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      permissions: state.api.currentUser.data.permissions,
    })
  ),
  withDispatch(),
  mapProps(
    ({ permissions, status, default: def, value, ...rest }: Props): Props => ({
      stringDef: typeToString(def),
      stringVal: typeToString(value),
      canEdit:
        status === 'unlocked' && hasPermission(permissions, 'OPTION-CONTROL'),
      def,
      value,
      status,
      permissions,
      ...rest,
    })
  ),
  withModal(),
  withHandlers({
    handleOptionSave: ({
      dispatchAction,
      closeModal,
      name,
    }: Props): Function => (model: Object, value: any): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'systemOptions' does not exist on type '{... Remove this comment to see the full error message
      dispatchAction(actions.systemOptions.setOption, name, value, closeModal);
    },
  }),
  withHandlers({
    handleEditClick: ({
      openModal,
      closeModal,
      handleOptionSave,
      ...rest
    }: Props): Function => (): void => {
      openModal(
        <OptionModal
          onClose={closeModal}
          onSave={handleOptionSave}
          model={rest}
        />
      );
    },
  }),
  pure(['value'])
)(OptionRow);
