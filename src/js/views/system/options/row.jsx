// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';

import { Tr, Td } from '../../../components/new_table';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';
import Badge from '../../../components/badge';
import OptionModal from './modal';
import Text from '../../../components/text';
import { Control as Button } from '../../../components/controls';
import Icon from '../../../components/icon';
import { hasPermission } from '../../../helpers/user';
import { typeToString } from '../../../helpers/system';

type Props = {
  setOption: Function,
  handleEditClick: Function,
  handleOptionSave : Function,
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
}: Props): React.Element<any> => (
  <Tr>
    <Td className="narrow">
      <Icon
        icon={status === 'locked' ? 'lock' : 'unlock'}
        tooltip={status === 'locked' ? 'Locked' : 'Unlocked'}
      />
    </Td>
    <Td className="name">
      <Text text={name} />
    </Td>
    <Td className="big">
      <Badge
        title="Workflow"
        val="W"
        label={workflow ? 'checked' : 'unchecked'}
      />
      {' '}
      <Badge
        title="Service"
        val="S"
        label={service ? 'checked' : 'unchecked'}
      />
      {' '}
      <Badge
        title="Job"
        val="J"
        label={job ? 'checked' : 'unchecked'}
      />
    </Td>
    <Td className="text">
      <Text text={stringDef} renderTree />
    </Td>
    <Td className="text">
      <Text text={stringVal} renderTree />
    </Td>
    <Td className="narrow">
      {canEdit && (
        <Button
          icon="edit"
          onClick={handleEditClick}
          btnStyle="success"
        />
      )}
    </Td>
  </Tr>
);

export default compose(
  connect(
    (state: Object): Object => ({
      permissions: state.api.currentUser.data.permissions,
    }),
    {
      setOption: actions.systemOptions.setOption,
    }
  ),
  mapProps(({ permissions, status, default: def, value, ...rest }: Props): Props => ({
    stringDef: typeToString(def),
    stringVal: typeToString(value),
    canEdit: status === 'unlocked' && hasPermission(permissions, 'OPTION-CONTROL'),
    def,
    value,
    status,
    permissions,
    ...rest,
  })),
  withModal(),
  withHandlers({
    handleOptionSave: ({
      setOption,
      closeModal,
      name,
    }: Props): Function => (model: Object, value: any): void => {
      setOption(name, value);
      closeModal();
    },
  }),
  withHandlers({
    handleEditClick: ({
      openModal,
      closeModal,
      handleOptionSave,
      ...rest,
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
