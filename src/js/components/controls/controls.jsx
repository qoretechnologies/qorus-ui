/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup } from '@blueprintjs/core';

type Props = {
  children: Array<React.Element<any>>,
  marginRight?: number,
};

/**
 * Container component for {@link Control} components.
 *
 * It allows overriding of child components props via its own
 * `controls` prop. This prop is an array of props objects in the same
 * order as child components.
 */
const Controls: Function = ({
  children,
  marginRight,
  className,
  ...rest
}: Props): React.Element<any> => (
  <ButtonGroup className={className} style={{ marginRight }} {...rest}>
    {children}
  </ButtonGroup>
);

export default pure(['children'])(Controls);
