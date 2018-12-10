import React from 'react';
import NoData from '../nodata';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  condition: boolean,
  children: any,
  title?: string,
  big?: boolean,
  inBox?: boolean,
};

const NoDataIf: Function = ({
  condition,
  children,
  title,
  big,
  inBox,
}: Props): React.Element<any> =>
  !condition ? (
    typeof children === 'function' ? (
      children()
    ) : (
      children
    )
  ) : (
    <NoData title={title} big={big} inBox={inBox} top />
  );

export default onlyUpdateForKeys(['condition', 'children'])(NoDataIf);
