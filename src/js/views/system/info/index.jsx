// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import InfoTable from '../../../components/info_table';
import Container from '../../../components/container';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';

const SystemInfoTable: Function = ({ data }: { data: Object }) => (
  <div>
    <Breadcrumbs>
      <Crumb>Info</Crumb>
    </Breadcrumbs>
    <Box noPadding top>
      <Container>
        <InfoTable object={data} />
      </Container>
    </Box>
  </div>
);

export default compose(
  connect(
    (state: Object): Object => ({
      data: state.api.system.data,
    })
  ),
  pure(['data'])
)(SystemInfoTable);
