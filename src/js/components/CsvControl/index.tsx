import React from 'react';

// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls, Control } from '../controls';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { injectIntl } from 'react-intl';

type Props = {
  onClick: Function,
  disabled: boolean,
};

const CsvControl: Function = ({
  onClick,
  disabled,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<Controls> => (
  <Controls>
    <Control
      big
      title={intl.formatMessage({ id: 'button.export-csv' })}
      text={intl.formatMessage({ id: 'button.export-csv' })}
      icon="export"
      disabled={disabled}
      onClick={onClick}
    />
  </Controls>
);

export default compose(pure, injectIntl)(CsvControl);
