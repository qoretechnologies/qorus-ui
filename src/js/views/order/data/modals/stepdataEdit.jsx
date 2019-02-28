// @flow
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
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

type StepDataEditModalProps = {
  onClose: Function,
  onSave: Function,
  indexData: string,
};

const StepDataEditModal: Function = ({
  onClose,
  handleSaveClick,
  data,
  handleDataChange,
  ind,
  stepId,
}: StepDataEditModalProps): React.Element<any> => (
  <Modal hasFooter>
    <Modal.Header titleId="stepDataEdit" onClose={onClose}>
      Edit step {stepId} data for index {ind}
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        <TextArea
          value={data}
          onChange={handleDataChange}
          rows={getLineCount(data) > 20 ? 20 : getLineCount(data) + 1}
        />
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
  withState('data', 'changeData', ({ indexData }) => indexData || '{}'),
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
