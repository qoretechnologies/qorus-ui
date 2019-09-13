// @flow
import React from 'react';
import compose from 'recompose/compose';

import Box from './box';
import { injectIntl } from 'react-intl';

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

const NoData: Function = ({ inBox, intl, ...rest }: Props): React.Element<any> =>
  inBox ? (
    <Box {...rest}>
      <NoDataContent
        title={intl.formatMessage({ id: 'component.no-data' })}
        content={intl.formatMessage({ id: 'component.there-are-no-data' })}
        {...rest}
      />
    </Box>
  ) : (
    <NoDataContent
      title={intl.formatMessage({ id: 'component.no-data' })}
      content={intl.formatMessage({ id: 'component.there-are-no-data' })}
      {...rest}
    />
  );

export default compose(
  injectIntl
)(NoData);
