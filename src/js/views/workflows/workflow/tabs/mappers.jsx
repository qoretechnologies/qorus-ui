// @flow
import React from 'react';

import Mappers from '../../../../containers/mappers';
import Box from '../../../../components/box';

type Props = {
  workflow: Object,
};

const MappersTab: Function = ({ workflow }: Props): React.Element<any> => (
  <Box top noPadding>
    <Mappers mappers={workflow.mappers} />
  </Box>
);

export default MappersTab;
