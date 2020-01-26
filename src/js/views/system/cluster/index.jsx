// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import { Tag } from '@blueprintjs/core';

import Node from './node';
import ClusterPane from './pane';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Box from '../../../components/box';
import withPane from '../../../hocomponents/pane';
import { calculateMemory } from '../../../helpers/system';
import titleManager from '../../../hocomponents/TitleManager';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import Flex from '../../../components/Flex';
import { injectIntl, FormattedMessage } from 'react-intl';

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
  intl,
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>
          <FormattedMessage id="cluster.cluster" />
        </Crumb>
      </Breadcrumbs>
      <Pull right>
        <Tag className="bp3-large">
          <FormattedMessage id="cluster.nodes" />: {Object.keys(nodes).length}
        </Tag>{' '}
        <Tag className="bp3-large">
          <FormattedMessage id="cluster.processes" />:{' '}
          {Object.keys(processes).length}
        </Tag>{' '}
        <Tag className="bp3-large">
          <FormattedMessage id="cluster.cluster-memory" />:{' '}
          {calculateMemory(nodesMemory)}
        </Tag>
      </Pull>
    </Headbar>
    <Box top fill scrollY>
      {Object.keys(nodes).map((node: string): any => {
        const list: Array<Object> = Object.keys(processes)
          .reduce((cur, process: string) => {
            const obj = { ...processes[process], id: process };

            return [...cur, obj];
          }, [])
          .filter(proc => proc.node === node);

        return (
          <Node
            openPane={openPane}
            closePane={closePane}
            paneId={paneId}
            key={node}
            node={node}
            processes={list}
            memory={nodes[node].node_priv}
          />
        );
      })}
    </Box>
  </Flex>
);

export default compose(
  connect((state: Object): Object => ({
    nodes: state.api.system.data.cluster_info,
    processes: state.api.system.data.processes,
  })),
  mapProps(({ nodes, ...rest }: Props): Props => ({
    nodesMemory: Object.keys(nodes).reduce(
      (cur, node): number => cur + nodes[node].node_priv,
      0
    ),
    nodes,
    ...rest,
  })),
  withPane(ClusterPane, ['processes']),
  titleManager('Cluster'),
  injectIntl
)(ClusterView);
