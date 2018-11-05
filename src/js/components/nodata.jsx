// @flow
import React from 'react';

import Box from './box';

type Props = {
  title: string,
  big?: boolean,
  content: string,
  inBox?: boolean,
};

const NoDataContent: Function = ({
  title: title = 'No data',
  big,
  content: content = 'There are no data to be displayed',
}: Props): React.Element<any> => (
  <div className={`no-data-element ${big ? '' : 'no-data-small'}`}>
    <h5>{title}</h5>
    {big && <div>{content}</div>}
  </div>
);

const NoData: Function = ({ inBox, ...rest }: Props): React.Element<any> =>
  inBox ? (
    <Box {...rest}>
      <NoDataContent {...rest} />
    </Box>
  ) : (
    <NoDataContent {...rest} />
  );

export default NoData;
