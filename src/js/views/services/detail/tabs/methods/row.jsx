// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';

import { Tr, Td } from '../../../../../components/new_table';
import Autocomponent from '../../../../../components/autocomponent';
import { Controls, Control as Button } from '../../../../../components/controls';
import SLAControl from '../../../../../components/sla_control';
import withModal from '../../../../../hocomponents/modal';
import ModalRun from './modal_run';
import ModalCode from './modal_code';
import { hasPermission } from '../../../../../helpers/user';

type Props = {
  method: Object,
  service: Object,
  openModal: Function,
  closeModal: Function,
  slavalue: string,
  changeSlaValue: Function,
  handleSlaChange: Function,
  handleRunClick: Function,
  handleCodeClick: Function,
  slas: Array<Object>,
  perms: Array<string>,
  canModify: boolean,
  setMethod: Function,
  removeMethod: Function,
  handleRemoveMethodClick: Function,
};

const MethodsRow: Function = ({
  method,
  handleRunClick,
  handleCodeClick,
  slas,
  canModify,
  service,
  setMethod,
  removeMethod,
}: Props): React.Element<any> => (
  <Tr>
    <Td className="name">{method.name}</Td>
    <Td className="tiny"><Autocomponent>{method.locktype}</Autocomponent></Td>
    <Td className="tiny"><Autocomponent>{method.internal}</Autocomponent></Td>
    <Td className="tiny"><Autocomponent>{method.write}</Autocomponent></Td>
    <Td className="normal">
      <Controls grouped>
        <Button
          icon="play"
          btnStyle="success"
          onClick={handleRunClick}
        />
        <Button
          icon="code"
          btnStyle="inverse"
          onClick={handleCodeClick}
        />
      </Controls>
    </Td>
    <Td className="text">
      <SLAControl
        canModify={canModify}
        slas={slas}
        type="service"
        model={service}
        method={method}
        setSla={setMethod}
        removeSla={removeMethod}
      />
    </Td>
  </Tr>
);

export default compose(
  withModal(),
  mapProps(({ perms, ...rest }: Props): Props => ({
    canModify: hasPermission(perms, ['MODIFY-SLA', 'SLA-CONTROL'], 'or'),
    perms,
    ...rest,
  })),
  withHandlers({
    handleRunClick: ({ openModal, closeModal, method, service }: Props): Function => (): void => {
      openModal(
        <ModalRun
          method={method}
          service={service}
          onClose={closeModal}
        />
      );
    },
    handleCodeClick: ({ openModal, closeModal, method, service }: Props): Function => (): void => {
      openModal(
        <ModalCode
          method={method}
          service={service}
          onClose={closeModal}
        />
      );
    },

  }),
  pure([
    'slas',
    'slavalue',
    'method',
    'service',
  ])
)(MethodsRow);