// @flow
import jsyaml from 'js-yaml';
import size from 'lodash/size';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import NoDataIf from '../../../components/NoDataIf';
import PaneItem from '../../../components/pane_item';
import Tree from '../../../components/tree';
import { normalizeName } from '../../../components/utils';
import withModal from '../../../hocomponents/modal';
import settings from '../../../settings';
import { fetchWithNotifications, put } from '../../../store/api/utils';
import StepdataEdit from './modals/stepdataEdit';

const StepDataView = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'order' does not exist on type 'Object'.
  order: { stepdata = [], id },
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleEditKeyClick' does not exist on ty... Remove this comment to see the full error message
  handleEditKeyClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Object): Array<React.Element<Tree>> => (
  <NoDataIf condition={size(stepdata) === 0}>
    {() =>
      stepdata.map(
        // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
        (step: Object): React.Element<Tree> => (
          // @ts-ignore ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
          <PaneItem title={`Step: ${normalizeName(step)} (${step.stepid})`}>
            {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
            <Tree
              // @ts-ignore ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
              key={step.stepid}
              id={id}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
              data={{ [step.stepid]: step.data }}
              caseSensitive
              editableKeys
              onKeyEditClick={(key: string, ind: number, id: number) => {
                handleEditKeyClick(
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
                  JSON.stringify(step.data[ind], null, 4),
                  key,
                  ind
                );
              }}
            />
          </PaneItem>
        )
      )
    }
  </NoDataIf>
);

export default compose(
  connect(),
  withModal(),
  withHandlers({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Object... Remove this comment to see the full error message
    handleStepDataSave:
      ({ dispatch, closeModal, order }: Object) =>
      (stepid: number, ind: number, newData: string): void => {
        fetchWithNotifications(
          async () => {
            const res: Object = await put(
              `${settings.REST_BASE_URL}/orders/${order.id}?action=yamlStepData`,
              {
                body: JSON.stringify({
                  stepid,
                  ind,
                  newdata: jsyaml.safeLoad(newData),
                }),
              }
            );

            // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
            if (!res.err) {
              closeModal();
            }

            return res;
          },
          'Saving new step data...',
          'Step data successfuly saved!',
          dispatch
        );
      },
  }),
  withHandlers({
    handleEditKeyClick:
      ({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Objec... Remove this comment to see the full error message
        openModal,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Obje... Remove this comment to see the full error message
        closeModal,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'order' does not exist on type 'Object'.
        order,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'handleStepDataSave' does not exist on ty... Remove this comment to see the full error message
        handleStepDataSave,
      }: Object): Function =>
      (data: string, stepId: number, index: number): void => {
        openModal(
          <StepdataEdit
            onClose={closeModal}
            stepId={stepId}
            orderId={order.id}
            ind={index}
            onSaveClick={handleStepDataSave}
          />
        );
      },
  })
)(StepDataView);
