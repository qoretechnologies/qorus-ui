import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import { Control, Controls } from '../controls';

type Props = {
  onClick: Function;
  disabled: boolean;
};

const CsvControl: Function = ({
  onClick,
  disabled,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
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

export default compose(injectIntl)(CsvControl);
