import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import ChartComponent from '../chart';

type Props = {
  states: Array<Object>;
  instances: any;
  width: number | string;
};

const InstancesChart: Function = ({ states, instances, width }: Props) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <ChartComponent
    width={width}
    height={150}
    isNotTime
    yAxisLabel="# of instances"
    unit=" "
    type="bar"
    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
    labels={states.map((state: any): string => state.name)}
    datasets={[
      {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        data: states.map((state: any): number => instances[state.name]),
        // @ts-ignore ts-migrate(2339) FIXME: Property 'color' does not exist on type 'Object'.
        backgroundColor: states.map((state: any): string => state.color),
        fill: false,
      },
    ]}
  />
);

export default pure(['width', 'instances', 'states'])(InstancesChart);
