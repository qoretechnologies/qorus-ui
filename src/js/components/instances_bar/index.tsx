import { Tooltip } from '@blueprintjs/core';
import { Link } from 'react-router';
import { calculateInstanceBarWidths, formatCount } from '../../helpers/orders';

type Props = {
  states: Array<Object>;
  instances: any;
  totalInstances: number;
  id: number;
  date: string;
  type: string;
  showPct: boolean;
  minWidth?: number;
  wrapperWidth: string | number;
  link?: string;
  big?: boolean;
  onClick: Function;
};

const InstancesBar: Function = ({
  states,
  instances,
  id,
  date,
  totalInstances,
  type = 'workflow',
  showPct,
  minWidth,
  wrapperWidth = '100%',
  link,
  big,
  onClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <div
    className={`instances-bar-wrapper ${big ? 'instances-bar-big' : ''}`}
    style={{ width: wrapperWidth }}
  >
    {totalInstances !== 0 ? (
      calculateInstanceBarWidths(states, instances, totalInstances, minWidth).map(
        (state: any, index: number) =>
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          instances[state.name] && instances[state.name] !== 0 ? (
            <Tooltip
              // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              content={`${state.name} - ${instances[state.name]}`}
              key={index}
              targetProps={{
                style: {
                  width: `${state.width}%`,
                },
              }}
            >
              <Link
                to={
                  onClick
                    ? null
                    : // @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Object'.
                      link || `/${type}/${id}?filter=${state.title}&date=${date}`
                }
                style={{
                  width: '100%',
                  display: 'inline-block',
                }}
              >
                <div
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
                  className={`instances-bar bar-${state.label}`}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                  key={state.name}
                  // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
                  onClick={onClick}
                  style={{
                    width: '100%',
                    display: 'inline-block',
                  }}
                >
                  {/* @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'. */}
                  <div className={`instance-bar-value bar-${state.label}`}>
                    {showPct
                      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'pct' does not exist on type 'Object'.
                        Math.round(state.pct)
                      : // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                        formatCount(instances[state.name])}
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
