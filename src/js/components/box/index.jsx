// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  noPadding: boolean,
  top: boolean,
  children: any,
};

const Box: Function = ({
  noPadding,
  children,
  top,
}: Props): React.Element<any> => (
  <div
    className="white-box"
    style={{ padding: noPadding ? 0 : null, marginTop: top ? 0 : null }}
  >
    {children}
  </div>
);

export default pure(['noPadding', 'children'])(Box);
