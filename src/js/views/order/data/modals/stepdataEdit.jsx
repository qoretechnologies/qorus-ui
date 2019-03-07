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
  handleSaveClick,
  data,
  handleDataChange,
  ind,
  stepId,
}: StepDataEditModalProps): React.Element<any> => (
  <Modal hasFooter height={400}>
    <Modal.Header titleId="stepDataEdit" onClose={onClose}>
      Edit step {stepId} data for index {ind}
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        {data ? (
          <TextArea
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
    handleDataChange: ({ changeData }: StepDataEditModalProps): Function => (
      event: Object
    ): void => {
      event.persist();

      changeData(() => event.target.value);
    },
    handleSaveClick: ({
      data,
      stepId,
      ind,
      onSaveClick,
    }: StepDataEditModalProps): Function => (): void => {
      if (onSaveClick) {
        onSaveClick(stepId, ind, data);
      }
    },
  }),
  onlyUpdateForKeys(['indexData', 'data'])
)(StepDataEditModal);
