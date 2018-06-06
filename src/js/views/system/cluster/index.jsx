// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import round from 'lodash/round';
import { Tag } from '@blueprintjs/core';

import Node from './node';
import ClusterPane from './pane';
import { InfoBar, InfoBarItem } from '../../../components/infobar/index';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Box from '../../../components/box';
import withPane from '../../../hocomponents/pane';

type Props = {
  nodes: Object,
  nodesMemory: number,
  processes: Object,
  openPane: Function,
  closePane: Function,
  paneId: string,
};

const ClusterView: Function = ({
  nodes,
  nodesMemory,
  processes,
  openPane,
  closePane,
  paneId,
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb> Cluster </Crumb>
    </Breadcrumbs>
    <Box top>
      <Tag>Nodes: {Object.keys(nodes).length}</Tag>{' '}
      <Tag>Processes: {Object.keys(processes).length}</Tag>{' '}
      <Tag>Cluster memory: {round(nodesMemory * 0.00000095367432, 2)} MiB</Tag>
    </Box>
    {Object.keys(nodes).map(
      (node: string): any => {
        const list: Array<Object> = Object.keys(processes).reduce(
          (cur, process: string) => {
            const obj = { ...processes[process], id: process };

            return [...cur, obj];
          },
          []
        );

        return (
          <Node
            openPane={openPane}
            closePane={closePane}
            paneId={paneId}
            key={node}
            node={node}
            processes={list}
            memory={nodes[node]}
          />
        );
      }
    )}
  </div>
);

export default compose(
  connect(
    (state: Object): Object => ({
      nodes: state.api.system.data.cluster_memory,
      processes: state.api.system.data.processes,
    })
  ),
  mapProps(
    ({ nodes, ...rest }: Props): Props => ({
      nodesMemory: Object.keys(nodes).reduce(
        (cur, node): number => cur + nodes[node],
        0
      ),
      nodes,
      ...rest,
    })
  ),
  withPane(ClusterPane, ['processes'])
)(ClusterView);
