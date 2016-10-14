/* @flow */
import React from 'react';
import MappersTable from '../../../../containers/mappers';

type Props = {
 job: Object,
}

const Mappers: Function = ({ job }: Props): React.Element<any> => (
  <MappersTable mappers={job.mappers} />
);

export default Mappers;
