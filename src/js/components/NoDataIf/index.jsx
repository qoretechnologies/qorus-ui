import React from 'react';
import NoData from '../nodata';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  condition: boolean,
  children: any,
  title?: string,
};

const NoDataIf: Function = ({
  condition,
  children,
  title,
}: Props): React.Element<any> =>
  !condition ? (
    typeof children === 'function' ? (
      children()
    ) : (
      children
    )
  ) : (
    <NoData title={title} />
  );

export default onlyUpdateForKeys(['condition', 'children'])(NoDataIf);
