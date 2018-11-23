// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

import Pane from '../../../components/pane';
import PaneItem from '../../../components/pane_item';
import Box from '../../../components/box';
import Tree from '../../../components/tree';
import titleManager from '../../../hocomponents/TitleManager';
import Alert from '../../../components/alert';

type Props = {
  onClose: Function,
  processes: Object,
  paneId: string,
  process?: string,
  urls: ?Array<string>,
};

const ClusterPane: Function = ({
  onClose,
  urls,
  process,
}: Props): React.Element<any> => (
  <Pane onClose={onClose} width={600} title="Node item detail">
    <Box top>
      {process ? (
        <PaneItem title={process}>
          <Tree data={urls} />
        </PaneItem>
      ) : (
        <Alert bsStyle="danger"> Process not found! </Alert>
      )}
    </Box>
  </Pane>
);

export default compose(
  mapProps(
    ({ processes, paneId, ...rest }: Props): Props => ({
      process: Object.keys(processes).find(
        (process: string): boolean => processes[process].id === paneId
      ),
      processes,
      paneId,
      ...rest,
    })
  ),
  mapProps(
    ({ process, processes, ...rest }: Props): Props => ({
      urls: process ? processes[process].urls : null,
      processes,
      process,
      ...rest,
    })
  ),
  titleManager(({ process }: Props): string => process, 'Cluster', 'prefix'),
  pure(['processes', 'paneId'])
)(ClusterPane);
