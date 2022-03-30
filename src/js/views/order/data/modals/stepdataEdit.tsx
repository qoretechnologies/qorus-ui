// @flow
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import lifecycle from 'recompose/lifecycle';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import jsyaml from 'js-yaml';

import Modal from '../../../../components/modal';
import Box from '../../../../components/box';
import { TextArea } from '@blueprintjs/core';
import withHandlers from 'recompose/withHandlers';
import { getLineCount } from '../../../../helpers/system';
import Pull from '../../../../components/Pull';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../../components/controls';
import Loader from '../../../../components/loader';
import { get } from '../../../../store/api/utils';
import settings from '../../../../settings';

type StepDataEditModalProps = {
  onClose: Function,
  onSave: Function,
  data: Object,
  orderId: number,
  ind: number,
  stepId: number,
};

const StepDataEditModal: Function = ({
  onClose,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleSaveClick' does not exist on type ... Remove this comment to see the full error message
  handleSaveClick,
  data,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleDataChange' does not exist on type... Remove this comment to see the full error message
  handleDataChange,
  ind,
  stepId,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: StepDataEditModalProps): React.Element<any> => (
  <Modal hasFooter height={400}>
    <Modal.Header titleId="stepDataEdit" onClose={onClose}>
      Edit step {stepId} data for index {ind}
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        {data ? (
          <TextArea
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Object' is not assignable to type 'string | ... Remove this comment to see the full error message
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
          <Button
            text="Save"
            icon="small-tick"
            btnStyle="success"
            onClick={handleSaveClick}
            big
          />
        </ButtonGroup>
      </Pull>
    </Modal.Footer>
  </Modal>
);

export default compose(
  withState('data', 'changeData', null),
  lifecycle({
    async componentDidMount () {
      const { orderId, changeData, stepId, ind } = this.props;
      const yamlData: Object = await get(
        `${
          settings.REST_BASE_URL
        }/orders/${orderId}?action=yamlStepData&stepid=${stepId}&ind=${ind}`
      );

      changeData(() => jsyaml.safeDump(yamlData));
    },
  }),
  withHandlers({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'changeData' does not exist on type 'Step... Remove this comment to see the full error message
    handleDataChange: ({ changeData }: StepDataEditModalProps): Function => (
      event: Object
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'persist' does not exist on type 'Object'... Remove this comment to see the full error message
      event.persist();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
      changeData(() => event.target.value);
    },
    handleSaveClick: ({
      data,
      stepId,
      ind,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onSaveClick' does not exist on type 'Ste... Remove this comment to see the full error message
      onSaveClick,
    }: StepDataEditModalProps): Function => (): void => {
      if (onSaveClick) {
        onSaveClick(stepId, ind, data);
      }
    },
  }),
  onlyUpdateForKeys(['indexData', 'data'])
)(StepDataEditModal);
