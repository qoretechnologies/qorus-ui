// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Masonry from 'react-masonry-layout';

import DetailTable from './table';
import Box from '../../../components/box';
import titleManager from '../../../hocomponents/TitleManager';
import Flex from '../../../components/Flex';

type Props = {
  onBackClick: Function,
  id: number,
  name: string,
  description: string,
  services: Array<Object>,
  workflows: Array<Object>,
  jobs: Array<Object>,
  roles: Array<Object>,
  mappers: Array<Object>,
  vmaps: Array<Object>,
  enabled: boolean,
};

const GroupDetail: Function = ({
  services,
  workflows,
  jobs,
  roles,
  mappers,
  vmaps,
}: Props): React.Element<any> => (
  <Flex scrollY>
    <Masonry
      id="group-masonry"
      sizes={[{ columns: 3, gutter: 15 }]}
      className="masonry masonryTriple"
      infiniteScrollDisabled
    >
      <Box column={3} noTransition top>
        <DetailTable
          data={services}
          columns={['type', 'autostart']}
          type="Services"
        />
      </Box>
      <Box column={3} noTransition top>
        <DetailTable data={workflows} type="Workflows" />
      </Box>
      <Box column={3} noTransition top>
        <DetailTable data={jobs} type="Jobs" />
      </Box>
      <Box column={3} noTransition top>
        <DetailTable data={roles} type="Roles" />
      </Box>
      <Box column={3} noTransition top>
        <DetailTable data={mappers} columns={['type']} type="Mappers" />
      </Box>
      <Box column={3} noTransition top>
        <DetailTable data={vmaps} type="Value maps" />
      </Box>
    </Masonry>
  </Flex>
);

export default compose(
  titleManager(({ name }: Props): string => name, 'Groups', 'prefix'),
  pure(['enabled'])
)(GroupDetail);
