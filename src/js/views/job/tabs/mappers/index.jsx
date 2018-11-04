/* @flow */
import React from 'react';
import MappersTable from '../../../../containers/mappers';
import Box from '../../../../components/box';

type Props = {
  job: Object,
};

const Mappers: Function = ({ job }: Props): React.Element<any> => (
  <Box top noPadding>
    <MappersTable mappers={job.mappers} />
  </Box>
);

export default Mappers;
