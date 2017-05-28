/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';

type Props = {
  grouped?: boolean,
  children: Array<React.Element<any>>,
  noControls?: boolean,
};

/**
 * Container component for {@link Control} components.
 *
 * It allows overriding of child components props via its own
 * `controls` prop. This prop is an array of props objects in the same
 * order as child components.
 */
const Controls: Function = ({
  grouped: grouped = false,
  children,
  noControls,
}: Props): React.Element<any> => (
  <div
    className={classNames({
      'btn-controls': !noControls,
      'btn-group': grouped,
    })}
  >
    {children}
  </div>
);

export default pure([
  'grouped',
  'children',
  'noControls',
])(Controls);
