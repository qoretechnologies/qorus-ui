// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import InfoTable from '../../../components/info_table';
import Box from '../../../components/box';
import Headbar from '../../../components/Headbar';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import titleManager from '../../../hocomponents/TitleManager';
import Flex from '../../../components/Flex';

const SystemInfoTable: Function = ({ data }: { data: Object }) => (
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
  connect(
    (state: Object): Object => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      data: state.api.system.data,
    })
  ),
  titleManager('Info'),
  pure(['data'])
)(SystemInfoTable);
