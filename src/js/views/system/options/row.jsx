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
  workflow: ?string,
  service: ?string,
  job: ?string,
  default?: any,
  def: ?any,
  value: ?any,
  openModal: Function,
  closeModal: Function,
  permissions: Array<string>,
  canEdit: boolean,
  stringDef: ?any,
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
