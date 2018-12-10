import React from 'react';

import { calculateInstanceBarWidths, formatCount } from '../../helpers/orders';
import { Tooltip } from '@blueprintjs/core';
import { Link } from 'react-router';

type Props = {
  states: Array<Object>,
  instances: Object,
  totalInstances: number,
  id: number,
  date: string,
  type: string,
  showPct: boolean,
  minWidth?: number,
  wrapperWidth: string | number,
  link?: string,
  big?: boolean,
};

const InstancesBar: Function = ({
  states,
  instances,
  id,
  date,
  totalInstances,
  type: type = 'workflow',
  showPct,
  minWidth,
  wrapperWidth: wrapperWidth = '100%',
  link,
  big,
}: Props): React.Element<any> => (
  <div
    className={`instances-bar-wrapper ${big ? 'instances-bar-big' : ''}`}
    style={{ width: wrapperWidth }}
  >
    {totalInstances !== 0 ? (
      calculateInstanceBarWidths(
        states,
        instances,
        totalInstances,
        minWidth
      ).map((state: Object, index: number) =>
        instances[state.name] && instances[state.name] !== 0 ? (
          <Tooltip
            content={`${state.name} - ${instances[state.name]}`}
            key={index}
          >
            <Link
              to={link || `/${type}/${id}?filter=${state.title}&date=${date}`}
            >
              <div
                className={`instances-bar bar-${state.label}`}
                key={state.name}
                style={{
                  width: `${state.width}%`,
                }}
              >
                <div className={`instance-bar-value bar-${state.label}`}>
                  {showPct
                    ? Math.round(state.pct)
                    : formatCount(instances[state.name])}
                </div>
              </div>
            </Link>
          </Tooltip>
        ) : null
      )
    ) : (
      <div className="instances-bar bar-none">
        <div className="instance-bar-value bar-none">0</div>
      </div>
    )}
  </div>
);

export default InstancesBar;
