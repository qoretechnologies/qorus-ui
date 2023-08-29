import { ReqoreButton, ReqoreControlGroup } from '@qoretechnologies/reqore';
import { memo, useEffect } from 'react';
import { Link } from 'react-router';
import { useMount, useUnmount } from 'react-use';
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
  onClick: () => void;
};

const InstancesBar: Function = memo(
  ({
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
  Props) => {
    useMount(() => console.log('mounted'));
    useUnmount(() => console.log('unmounted'));
    useEffect(() => console.log('re-rendered'));

    return (
      <ReqoreControlGroup style={{ width: wrapperWidth }} stack fluid>
        {totalInstances !== 0 ? (
          calculateInstanceBarWidths(states, instances, totalInstances, minWidth).map(
            (state: any, index: number) =>
              instances[state.name] && instances[state.name] !== 0 ? (
                <ReqoreButton
                  key={state.name}
                  onClick={onClick}
                  tooltip={`${state.name} - ${instances[state.name]}`}
                  textAlign="center"
                  customTheme={{
                    main: state.color,
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
                    {showPct
                      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'pct' does not exist on type 'Object'.
                        Math.round(state.pct)
                      : // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                        formatCount(instances[state.name])}
                  </Link>
                </ReqoreButton>
              ) : null
          )
        ) : (
          <ReqoreButton disabled textAlign="center">
            0
          </ReqoreButton>
        )}
      </ReqoreControlGroup>
    );
  }
);

export default InstancesBar;
