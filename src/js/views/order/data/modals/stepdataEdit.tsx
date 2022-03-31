// @flow
import { TextArea } from '@blueprintjs/core';
import jsyaml from 'js-yaml';
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import Box from '../../../../components/box';
import { Control as Button, Controls as ButtonGroup } from '../../../../components/controls';
import Loader from '../../../../components/loader';
import Modal from '../../../../components/modal';
import Pull from '../../../../components/Pull';
import { getLineCount } from '../../../../helpers/system';
import settings from '../../../../settings';
import { get } from '../../../../store/api/utils';

type StepDataEditModalProps = {
  onClose: Function;
  onSave: Function;
  data: any;
  orderId: number;
  ind: number;
  stepId: number;
};

const StepDataEditModal: Function = ({
  onClose,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleSaveClick' does not exist on type ... Remove this comment to see the full error message
  handleSaveClick,
  data,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleDataChange' does not exist on type... Remove this comment to see the full error message
  handleDataChange,
  ind,
  stepId,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
StepDataEditModalProps) => (
  <Modal hasFooter height={400}>
    <Modal.Header titleId="stepDataEdit" onClose={onClose}>
      Edit step {stepId} data for index {ind}
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        {data ? (
          <TextArea
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Object' is not assignable to type 'string | ... Remove this comment to see the full error message
            value={data}
            onChange={handleDataChange}
            rows={getLineCount(data) > 20 ? 20 : getLineCount(data) + 1}
          />
        ) : (
          <Loader />
        )}
      </Box>
    </Modal.Body>
    <Modal.Footer>
      <Pull right>
        <ButtonGroup>
          <Button text="Cancel" icon="cross" onClick={onClose} big />
          <Button text="Save" icon="small-tick" btnStyle="success" onClick={handleSaveClick} big />
        </ButtonGroup>
      </Pull>
    </Modal.Footer>
  </Modal>
);

export default compose(
  withState('data', 'changeData', null),
  lifecycle({
    async componentDidMount() {
      const { orderId, changeData, stepId, ind } = this.props;
      const yamlData: any = await get(
        `${settings.REST_BASE_URL}/orders/${orderId}?action=yamlStepData&stepid=${stepId}&ind=${ind}`
      );

      changeData(() => jsyaml.safeDump(yamlData));
    },
  }),
  withHandlers({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'changeData' does not exist on type 'Step... Remove this comment to see the full error message
    handleDataChange:
      ({ changeData }: any): Function =>
      (event: any): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
        event.persist();

        // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
        changeData(() => event.target.value);
      },
    handleSaveClick:
      ({
        data,
        stepId,
        ind,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'onSaveClick' does not exist on type 'Ste... Remove this comment to see the full error message
        onSaveClick,
      }: StepDataEditModalProps): Function =>
      (): void => {
        if (onSaveClick) {
          onSaveClick(stepId, ind, data);
        }
      },
  }),
  onlyUpdateForKeys(['indexData', 'data'])
)(StepDataEditModal);
