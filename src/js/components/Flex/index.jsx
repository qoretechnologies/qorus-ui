// @flow
import React from 'react';

type FlexProps = {
  children: any,
  display?: string,
  flexFlow?: string,
  flex?: string,
  height?: any,
  className?: string,
  style?: Object,
  scrollX?: boolean,
  scrollY?: boolean,
  flexRef?: Function,
};

const Flex: Function = ({
  children,
  display: display = 'flex',
  flexFlow: flexFlow = 'column',
  flex: flex = '1 1 auto',
  height,
  style,
  className,
  scrollX,
  scrollY,
  flexRef,
}: FlexProps): React.Element<any> => (
  <div
    style={{
      ...style,
      display,
      flexFlow,
      flex,
      height,
      overflowX: scrollX ? 'auto' : 'hidden',
      overflowY: scrollY ? 'auto' : 'hidden',
    }}
    ref={ref => flexRef && flexRef(ref)}
    className={className}
  >
    {children}
  </div>
);

export default Flex;