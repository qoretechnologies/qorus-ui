import map from 'lodash/map';
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import styled from 'styled-components';
import Box from '../../../../components/box';
import ContentByType from '../../../../components/ContentByType';
import Modal from '../../../../components/modal';

type Props = {
  detail: any;
  onClose: Function;
};

const StyledInfoWrapper = styled.div`
  display: flex;

  span {
    font-weight: normal;
    &:first-child {
      font-weight: bold;
    }
    font-size: 18px;
    line-height: 1;
    margin-right: 10px;
  }
`;

// @ts-ignore ts-migrate(2339) FIXME: Property 'tab' does not exist on type 'Props'.
const DetailModal: Function = ({ detail, onClose, tab }: Props): any => (
  <Modal width={600}>
    <Modal.Header onClose={onClose} titleId="diagram-modal">
      Detail
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        {map(detail, (data, key) => (
          <StyledInfoWrapper>
            <span>{key}: </span>
            <span>
              <ContentByType content={data} />
            </span>
          </StyledInfoWrapper>
        ))}
      </Box>
    </Modal.Body>
  </Modal>
);

export default onlyUpdateForKeys(['detail'])(DetailModal);
