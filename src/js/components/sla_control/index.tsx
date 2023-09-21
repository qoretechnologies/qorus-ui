// @flow
import { Intent } from '@blueprintjs/core';
import { ReqoreButton, ReqoreControlGroup, ReqoreDropdown } from '@qoretechnologies/reqore';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import NoData from '../../components/nodata';
import withModal from '../../hocomponents/modal';
import ConfirmDialog from '../confirm_dialog';

type Props = {
  canModify: boolean;
  slas: Array<Object>;
  handleRemoveClick: Function;
  type: string;
  slavalue: string;
  handleSlaChange: Function;
  model: any;
  method: any;
  setSla: Function;
  removeSla: Function;
  openModal: Function;
  closeModal: Function;
  changeSlaValue: Function;
};

const SLAControl: Function = ({
  canModify,
  slas,
  handleRemoveClick,
  slavalue,
  handleSlaChange,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  if (canModify) {
    return (
      <ReqoreControlGroup>
        {slas.length > 0 ? (
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <ReqoreDropdown
            items={slas.map((sla) => ({
              label: sla.name,
              value: sla.name,
              selected: slavalue === sla.name,
            }))}
            onItemSelect={({ label }) => {
              handleSlaChange(null, label);
            }}
            label={slavalue || 'None'}
          />
        ) : (
          <p>{slavalue || 'None'}</p>
        )}
        {slavalue && slavalue !== 'None' && (
          <ReqoreButton
            icon="CloseLine"
            intent={Intent.DANGER}
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
            onClick={handleRemoveClick}
          />
        )}
      </ReqoreControlGroup>
    );
  }

  return slavalue && slavalue !== '' ? <p>{slavalue}</p> : <NoData />;
};

export default compose(
  withModal(),
  withState('slavalue', 'changeSlaValue', ({ model, type, method }: Props): string =>
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sla' does not exist on type 'Object'.
    type === 'service' ? method.sla : model.sla
  ),
  withHandlers({
    handleSlaChange:
      ({ changeSlaValue, model, method, setSla, type }: Props): Function =>
      (ev: any, sla: string): void => {
        changeSlaValue(() => sla);

        if (type === 'service') {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          setSla(model.name, method.name, sla);
        } else {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          setSla(model.name, sla);
        }
      },
    handleRemoveClick:
      ({
        openModal,
        closeModal,
        method,
        model,
        slavalue,
        removeSla,
        changeSlaValue,
        type,
      }: Props): Function =>
      (): void => {
        const onConfirm: Function = (): void => {
          changeSlaValue(() => 'None');

          if (type === 'service') {
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            removeSla(model.name, method.name, slavalue);
          } else {
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            removeSla(model.name, slavalue);
          }

          closeModal();
        };

        openModal(
          <ConfirmDialog onConfirm={onConfirm} onClose={closeModal}>
            Are you sure you want to remove the associated SLA from this{' '}
            {type === 'service' ? 'method' : 'job'}?
          </ConfirmDialog>
        );
      },
  }),
  pure(['canModify', 'type', 'model', 'slas', 'method', 'slavalue'])
)(SLAControl);
