// @flow
import React from 'react';
import Tree from '../../../components/tree';
import PaneItem from '../../../components/pane_item';
import { normalizeName } from '../../../components/utils';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withModal from '../../../hocomponents/modal';
import StepdataEdit from './modals/stepdataEdit';
import { connect } from 'react-redux';
import { put, fetchWithNotifications } from '../../../store/api/utils';
import settings from '../../../settings';
import jsyaml from 'js-yaml';
import size from 'lodash/size';
import NoDataIf from '../../../components/NoDataIf';

const StepDataView = ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'order' does not exist on type 'Object'.
  order: { stepdata = [], id },
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleEditKeyClick' does not exist on ty... Remove this comment to see the full error message
  handleEditKeyClick,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Object): Array<React.Element<Tree>> => (
  <NoDataIf condition={size(stepdata) === 0}>
    {() =>
      stepdata.map(
        // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
        (step: Object): React.Element<Tree> => (
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
          <PaneItem title={`Step: ${normalizeName(step)} (${step.stepid})`}>
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            <Tree
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
              key={step.stepid}
              id={id}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
              data={{ [step.stepid]: step.data }}
              caseSensitive
              editableKeys
              onKeyEditClick={(key: string, ind: number, id: number) => {
                handleEditKeyClick(
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Object... Remove this comment to see the full error message
    handleStepDataSave: ({ dispatch, closeModal, order }: Object) => (
      stepid: number,
      ind: number,
      newData: string
    ): void => {
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

          // @ts-expect-error ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
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
    handleEditKeyClick: ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openModal' does not exist on type 'Objec... Remove this comment to see the full error message
      openModal,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'closeModal' does not exist on type 'Obje... Remove this comment to see the full error message
      closeModal,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'order' does not exist on type 'Object'.
      order,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleStepDataSave' does not exist on ty... Remove this comment to see the full error message
      handleStepDataSave,
    }: Object): Function => (
      data: string,
      stepId: number,
      index: number
    ): void => {
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
