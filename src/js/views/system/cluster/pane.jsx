// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';

import Pane from '../../../components/pane';
import Tree from '../../../components/tree';
import titleManager from '../../../hocomponents/TitleManager';

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
  <Pane onClose={onClose} width={600}>
    <article>
      <h3>{process || 'Error: process not found'}</h3>
      {urls && (
        <div>
          <h4> Urls</h4>
          <Tree data={urls} />
        </div>
      )}
    </article>
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
