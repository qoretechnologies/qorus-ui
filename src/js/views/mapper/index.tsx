/* @flow */
import React from 'react';
import Mapper from '../../containers/mappers/info';
import titleManager from '../../hocomponents/TitleManager';

type Props = {
  params: any;
  location: any;
};

const MapperView: Function = ({
  params,
  location,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
  <Mapper mapperId={params.id} location={location} />
);

export default titleManager('Mappers')(MapperView);
