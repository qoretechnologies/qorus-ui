// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type FlexProps = {
  children: any,
  display?: string,
  flexFlow?: string,
  flex?: string,
  height?: any,
  className?: string,
  style?: Object,
};

const Flex: Function = ({
  children,
  display: display = 'flex',
  flexFlow: flexFlow = 'column',
  flex: flex = '1 1 auto',
  height,
  style,
  className,
}: FlexProps): React.Element<any> => (
  <div
    style={{
      ...style,
      display,
      flexFlow,
      flex,
      height,
    }}
    className={className}
  >
    {children}
  </div>
);

export default Flex;
