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
    className={className}
  >
    {children}
  </div>
);

export default Flex;
