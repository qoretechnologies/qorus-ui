/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup } from '@blueprintjs/core';

type Props = {
  children: Array<React.Element<any>>,
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
  ...rest
}: Props): React.Element<any> => (
  <ButtonGroup {...rest}>{children}</ButtonGroup>
);

export default pure(['children'])(Controls);
