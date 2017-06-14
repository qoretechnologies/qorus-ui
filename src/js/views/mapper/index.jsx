/* @flow */
import React from 'react';

import Mapper from '../../containers/mappers/info';

type Props = {
  params: Object,
  location: Object,
};

const MapperView: Function = ({ params, location }: Props): React.Element<any> => (
  <Mapper
    mapperId={params.id}
    location={location}
  />
);

export default MapperView;
