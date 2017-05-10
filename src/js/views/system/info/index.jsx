// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import InfoTable from '../../../components/info_table';
import Container from '../../../components/container';

const SystemInfoTable: Function = ({ data }: { data: Object }) => (
  <Container>
    <InfoTable object={data} />
  </Container>
);

export default compose(
  connect(
    (state: Object): Object => ({
      data: state.api.system.data,
    })
  ),
  pure(['data'])
)(SystemInfoTable);
