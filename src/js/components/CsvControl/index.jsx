import React from 'react';

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
  intl
}: Props): React.Element<Controls> => (
  <Controls>
    <Control
      big
      title={intl.formatMessage({ id: 'global.export-csv' })}
      text={intl.formatMessage({ id: 'global.export-csv' })}
      iconName="export"
      disabled={disabled}
      onClick={onClick}
    />
  </Controls>
);

export default compose(pure, injectIntl)(CsvControl);
