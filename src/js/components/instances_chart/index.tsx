import React from 'react';
import ChartComponent from '../chart';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  states: Array<Object>,
  instances: Object,
  width: number | string,
};

const InstancesChart: Function = ({ states, instances, width }: Props) => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <ChartComponent
    width={width}
    height={150}
    isNotTime
    yAxisLabel="# of instances"
    unit=" "
    type="bar"
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
    labels={states.map((state: Object): string => state.name)}
    datasets={[
      {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        data: states.map((state: Object): number => instances[state.name]),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'color' does not exist on type 'Object'.
        backgroundColor: states.map((state: Object): string => state.color),
        fill: false,
      },
    ]}
  />
);

export default pure(['width', 'instances', 'states'])(InstancesChart);
