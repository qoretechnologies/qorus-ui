// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Node from './node';

type Props = {
  nodes: Object,
  processes: Object,
};

const ClusterView: Function = ({
  nodes,
  processes,
}: Props): React.Element<any> =>
  console.log('updated node') || (
    <div className="tab-pane active">
      {Object.keys(nodes).map((node: string): any => {
        const list: Array<Object> = Object.keys(processes).reduce(
          (cur, process: string) => {
            const obj = { ...processes[process], id: process };

            return [...cur, obj];
          },
          []
        );

        return (
          <Node key={node} node={node} processes={list} memory={nodes[node]} />
        );
      })}
    </div>
  );

export default compose(
  connect((state: Object): Object => ({
    nodes: state.api.system.data.cluster_memory,
    processes: state.api.system.data.processes,
  }))
)(ClusterView);
