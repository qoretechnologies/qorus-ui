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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
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
