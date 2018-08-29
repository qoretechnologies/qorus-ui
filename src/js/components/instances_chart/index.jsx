import React from 'react';
import ChartComponent from '../chart';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  states: Array<Object>,
  instances: Object,
  width: number | string,
};

const InstancesChart: Function = ({ states, instances, width }: Props) => (
  <ChartComponent
    width={width}
    height={150}
    isNotTime
    yAxisLabel="# of instances"
    unit=" "
    type="bar"
    labels={states.map((state: Object): string => state.name)}
    datasets={[
      {
        data: states.map((state: Object): number => instances[state.name]),
        backgroundColor: states.map((state: Object): string => state.color),
        fill: false,
      },
    ]}
  />
);

export default pure(['width', 'instances', 'states'])(InstancesChart);
