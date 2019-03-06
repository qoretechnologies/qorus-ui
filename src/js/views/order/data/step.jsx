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
  order: { stepdata = [], id },
  handleEditKeyClick,
}: Object): Array<React.Element<Tree>> => (
  <NoDataIf condition={size(stepdata) === 0}>
    {() =>
      stepdata.map(
        (step: Object): React.Element<Tree> => (
          <PaneItem title={`Step: ${normalizeName(step)} (${step.stepid})`}>
            <Tree
              key={step.stepid}
              id={id}
              data={{ [step.stepid]: step.data }}
              caseSensitive
              editableKeys
              onKeyEditClick={(key: string, ind: number, id: number) => {
                handleEditKeyClick(
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
      openModal,
      closeModal,
      order,
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
