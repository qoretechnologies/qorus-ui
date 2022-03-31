// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import Flex from '../../../components/Flex';
import { MasonryLayout, MasonryPanel } from '../../../components/MasonryLayout';
import titleManager from '../../../hocomponents/TitleManager';
import DetailTable from './table';

type Props = {
  onBackClick: Function;
  id: number;
  name: string;
  description: string;
  services: Array<Object>;
  workflows: Array<Object>;
  jobs: Array<Object>;
  roles: Array<Object>;
  mappers: Array<Object>;
  vmaps: Array<Object>;
  enabled: boolean;
};

const GroupDetail: Function = ({
  services,
  workflows,
  jobs,
  roles,
  mappers,
  vmaps,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex scrollY>
    <MasonryLayout columns={3}>
      <MasonryPanel>
        <Box top>
          <DetailTable data={services} columns={['type', 'autostart']} type="Services" />
        </Box>
      </MasonryPanel>
      <MasonryPanel>
        <Box top>
          <DetailTable data={workflows} type="Workflows" />
        </Box>
      </MasonryPanel>
      <MasonryPanel>
        <Box top>
          <DetailTable data={jobs} type="Jobs" />
        </Box>
      </MasonryPanel>
      <MasonryPanel>
        <Box top>
          <DetailTable data={roles} type="Roles" />
        </Box>
      </MasonryPanel>
      <MasonryPanel>
        <Box top>
          <DetailTable data={mappers} columns={['type']} type="Mappers" />
        </Box>
      </MasonryPanel>
      <MasonryPanel>
        <Box top>
          <DetailTable data={vmaps} type="Value maps" />
        </Box>
      </MasonryPanel>
    </MasonryLayout>
  </Flex>
);

export default compose(
  // @ts-ignore ts-migrate(2345) FIXME: Argument of type '({ name }: Props) => string' is ... Remove this comment to see the full error message
  titleManager(({ name }: Props): string => name, 'Groups', 'prefix'),
  pure(['enabled'])
)(GroupDetail);
