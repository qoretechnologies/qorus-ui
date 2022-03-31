// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import InfoTable from '../../../components/info_table';
import titleManager from '../../../hocomponents/TitleManager';

const SystemInfoTable: Function = ({ data }: { data: any }) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>Info</Crumb>
      </Breadcrumbs>
    </Headbar>
    <Box fill top>
      <InfoTable object={data} />
    </Box>
  </Flex>
);

export default compose(
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    data: state.api.system.data,
  })),
  titleManager('Info'),
  pure(['data'])
)(SystemInfoTable);
