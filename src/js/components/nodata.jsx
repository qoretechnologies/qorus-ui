// @flow
import React from 'react';
import compose from 'recompose/compose';

import Box from './box';
import { injectIntl } from 'react-intl';

type Props = {
  title?: string,
  big?: boolean,
  content?: string,
  inBox?: boolean,
};

const NDC: Function = ({
  title,
  big,
  content,
  intl,
}: Props): React.Element<any> => (
  <div className={`no-data-element ${big ? '' : 'no-data-small'}`}>
    <h5>{title || intl.formatMessage({ id: 'component.no-data' })}</h5>
    {big &&
      <div>
        {content || intl.formatMessage({ id: 'component.there-are-no-data' })}
      </div>
    }
  </div>
);
const NoDataContent = injectIntl(NDC);

const NoData: Function = ({ inBox, intl, ...rest }: Props): React.Element<any> =>
  inBox ? (
    <Box {...rest}>
      <NoDataContent {...rest} />
    </Box>
  ) : (
    <NoDataContent {...rest} />
  );

export default compose(
  injectIntl
)(NoData);
