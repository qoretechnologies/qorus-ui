// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import compose from 'recompose/compose';

import Dropdown, { Control as Toggle, Item } from '../dropdown';
import { Controls, Control as Button } from '../controls';
import ConfirmDialog from '../confirm_dialog';
import withModal from '../../hocomponents/modal';

type Props = {
  canModify: boolean,
  slas: Array<Object>,
  handleRemoveClick: Function,
  type: string,
  slavalue: string,
  handleSlaChange: Function,
  model: Object,
  method: Object,
  setSla: Function,
  removeSla: Function,
  openModal: Function,
  closeModal: Function,
  changeSlaValue: Function,
};

const SLAControl: Function = ({
  canModify,
  slas,
  handleRemoveClick,
  slavalue,
  handleSlaChange,
}: Props): React.Element<any> => {
  if (canModify) {
    return (
      <Controls noControls grouped>
        <Dropdown>
          <Toggle small>{slavalue || 'None'}</Toggle>
          {slas.map((sla: Object): React.Element<any> => (
            <Item
              key={sla.slaid}
              title={sla.name}
              action={handleSlaChange}
            />
          ))}
        </Dropdown>
        {(slavalue && slavalue !== 'None') && (
          <Button
            icon="times"
            btnStyle="danger"
            onClick={handleRemoveClick}
          />
        )}
      </Controls >
    );
  }

  return (
    <p>{slavalue}</p>
  );
};

export default compose(
  withModal(),
  withState('slavalue', 'changeSlaValue', ({ model, type, method }: Props): string => (
    type === 'service' ? method.sla : model.sla
  )),
  withHandlers({
    handleSlaChange: ({
      changeSlaValue,
      model,
      method,
      setSla,
      type,
    }: Props): Function => (ev: Object, sla: string): void => {
      changeSlaValue(() => sla);

      if (type === 'service') {
        setSla(model.name, method.name, sla);
      } else {
        setSla(model.name, sla);
      }
    },
    handleRemoveClick: ({
      openModal,
      closeModal,
      method,
      model,
      slavalue,
      removeSla,
      changeSlaValue,
      type,
    }: Props): Function => (): void => {
      const onConfirm: Function = (): void => {
        changeSlaValue(() => 'None');

        if (type === 'service') {
          removeSla(model.name, method.name, slavalue);
        } else {
          removeSla(model.name, slavalue);
        }

        closeModal();
      };

      openModal(
        <ConfirmDialog
          onConfirm={onConfirm}
          onClose={closeModal}
        >
          Are you sure you want to remove the associated
          SLA from this {type === 'service' ? 'method' : 'job'}?
      </ConfirmDialog>
      );
    },
  }),
  pure([
    'canModify',
    'type',
    'model',
    'slas',
    'method',
    'slavalue',
  ])
)(SLAControl);
