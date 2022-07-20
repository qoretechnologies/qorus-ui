// @flow
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import Box from './box';

type Props = {
  title?: string;
  big?: boolean;
  content?: string;
  inBox?: boolean;
};

const NDC: Function = ({
  title,
  big,
  content,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <div className={`no-data-element ${big ? '' : 'no-data-small'}`}>
    <h5>{title || intl.formatMessage({ id: 'component.no-data' })}</h5>
    {big && <div>{content || intl.formatMessage({ id: 'component.there-are-no-data' })}</div>}
  </div>
);
const NoDataContent = injectIntl(NDC as any) as any;

// @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
const NoData: Function = ({ inBox, intl, ...rest }: Props) =>
  inBox ? (
    <Box {...rest}>
      <NoDataContent {...rest} />
    </Box>
  ) : (
    <NoDataContent {...rest} />
  );

export default compose(injectIntl)(NoData);
