// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Modal from '../../../../components/modal';
import Loader from '../../../../components/loader';
import Box from '../../../../components/box';
import withState from 'recompose/withState';
import lifecycle from 'recompose/lifecycle';
import { get } from '../../../../store/api/utils';
import settings from '../../../../settings';

type ResourceFileModalProps = {
  onClose: Function,
  name: string,
  contents: string,
};

const ResourceFileModal: Function = ({
  name,
  onClose,
  contents,
}: ResourceFileModalProps): React.Element<any> => (
  <Modal width="80vw">
    <Modal.Header titleId="resourceFile" onClose={onClose}>
      {name} contents
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        {contents ? <pre>{contents.data}</pre> : <Loader />}
      </Box>
    </Modal.Body>
  </Modal>
);

export default compose(
  withState('contents', 'setContents', null),
  lifecycle({
    async componentDidMount () {
      const { id, name, setContents } = this.props;
      const contents = await get(
        `${settings.REST_BASE_URL}/services/${id}/resource_files/${name}`
      );

      setContents(() => contents);
    },
  }),
  onlyUpdateForKeys(['id', 'contents'])
)(ResourceFileModal);
