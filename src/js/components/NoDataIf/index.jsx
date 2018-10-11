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
  !condition ? children : <NoData title={title} />;

export default onlyUpdateForKeys(['condition', 'children'])(NoDataIf);
