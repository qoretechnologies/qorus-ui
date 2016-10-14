/* @flow */
import React from 'react';

import Mapper from '../../containers/mappers/info';

type Props = {
  params: Object
}

const MapperView: Function = ({ params }: Props): React.Element<any> => (
  <Mapper mapperId={params.id} />
);

export default MapperView;
