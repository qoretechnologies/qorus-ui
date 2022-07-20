// @flow
import { Tag } from '@blueprintjs/core';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import { calculateMemory } from '../../../helpers/system';
import withPane from '../../../hocomponents/pane';
import titleManager from '../../../hocomponents/TitleManager';
import Node from './node';
import ClusterPane from './pane';

type Props = {
  nodes: any;
  nodesMemory: number;
  processes: any;
  openPane: Function;
  closePane: Function;
  paneId: string;
};

const ClusterView: Function = ({
  nodes,
  nodesMemory,
  processes,
  openPane,
  closePane,
  paneId,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
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
          <FormattedMessage id="cluster.processes" />: {Object.keys(processes).length}
        </Tag>{' '}
        <Tag className="bp3-large">
          <FormattedMessage id="cluster.cluster-memory" />: {calculateMemory(nodesMemory)}
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
          .filter((proc) => proc.node === node);

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
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    nodes: state.api.system.data.cluster_info,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    processes: state.api.system.data.processes,
  })),
  mapProps(
    ({ nodes, ...rest }: Props): Props => ({
      nodesMemory: Object.keys(nodes).reduce((cur, node): number => cur + nodes[node].node_priv, 0),
      nodes,
      ...rest,
    })
  ),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  withPane(ClusterPane, ['processes']),
  titleManager('Cluster'),
  injectIntl
)(ClusterView);
