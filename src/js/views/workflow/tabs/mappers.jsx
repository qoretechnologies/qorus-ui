// @flow
import React from 'react';

import Mappers from '../../../containers/mappers';

type Props = {
  workflow: Object,
};

const MappersTab: Function = ({ workflow }: Props): React.Element<any> => (
  <Mappers
    mappers={workflow.mappers}
  />
);

export default MappersTab;
