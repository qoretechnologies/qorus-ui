// @flow
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumn } from '../../../../components/ActionColumn';
import ContentByType from '../../../../components/ContentByType';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { ReqoreButton, ReqoreControlGroup } from '@qoretechnologies/reqore';
import NameColumn from '../../../../components/NameColumn';
import { Td, Tr } from '../../../../components/new_table';
import SLAControl from '../../../../components/sla_control';
import { hasPermission } from '../../../../helpers/user';
import withModal from '../../../../hocomponents/modal';
import withDispatch from '../../../../hocomponents/withDispatch';
import actions from '../../../../store/api/actions';
import ModalCode from './modal_code';
import ModalRun from './modal_run';

type Props = {
  method: any;
  service: any;
  openModal: Function;
  closeModal: Function;
  slavalue: string;
  changeSlaValue: Function;
  handleSlaChange: Function;
  handleRunClick: Function;
  handleCodeClick: Function;
  slas: Array<Object>;
  perms: Array<string>;
  canModify: boolean;
  handleSLAChange: Function;
  dispatchAction: Function;
  handleSLARemove: Function;
  handleRemoveMethodClick: Function;
  first: boolean;
};

const MethodsRow: Function = ({
  method,
  handleRunClick,
  handleCodeClick,
  slas,
  canModify,
  service,
  handleSLAChange,
  handleSLARemove,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message
  <Tr title={method.description} first={first}>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
    <NameColumn name={method.name} />
    <ActionColumn>
      <ReqoreControlGroup stack size="small">
        <ReqoreButton icon="PlayLine" onClick={handleRunClick} />
        <ReqoreButton icon="CodeLine" onClick={handleCodeClick} />
      </ReqoreControlGroup>
    </ActionColumn>
    <Td className="narrow">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'locktype' does not exist on type 'Object... Remove this comment to see the full error message */}
      <ContentByType content={method.locktype} />
    </Td>
    <Td className="tiny">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'internal' does not exist on type 'Object... Remove this comment to see the full error message */}
      <ContentByType content={method.internal} />
    </Td>
    <Td className="tiny">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'write' does not exist on type 'Object'. */}
      <ContentByType content={method.write} />
    </Td>
    <Td className="text">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
      {service.type === 'user' && (
        <SLAControl
          canModify={canModify}
          slas={slas}
          type="service"
          model={service}
          method={method}
          setSla={handleSLAChange}
          removeSla={handleSLARemove}
        />
      )}
    </Td>
  </Tr>
);

export default compose(
  withDispatch(),
  withModal(),
  mapProps(
    ({ perms, ...rest }: Props): Props => ({
      canModify: hasPermission(perms, ['MODIFY-SLA', 'SLA-CONTROL'], 'or'),
      perms,
      ...rest,
    })
  ),
  withHandlers({
    handleRunClick:
      ({ openModal, closeModal, method, service }: Props): Function =>
      (): void => {
        openModal(
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <ModalRun method={method} service={service} onClose={closeModal} />
        );
      },
    handleCodeClick:
      ({ openModal, closeModal, method }: Props): Function =>
      (): void => {
        openModal(<ModalCode method={method} onClose={closeModal} />);
      },
    handleSLAChange:
      ({ dispatchAction }: Props): Function =>
      (modelName, methodName, sla): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
        dispatchAction(actions.services.setSLAMethod, modelName, methodName, sla);
      },
    handleSLARemove:
      ({ dispatchAction }: Props): Function =>
      (modelName, methodName, sla): void => {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
          actions.services.removeSLAMethod,
          modelName,
          methodName,
          sla
        );
      },
  }),
  pure(['slas', 'slavalue', 'method', 'service'])
)(MethodsRow);
