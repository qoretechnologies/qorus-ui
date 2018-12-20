import React from 'react';

import { Controls, Control } from '../controls';
import pure from 'recompose/pure';

type Props = {
  onClick: Function,
  disabled: boolean,
};

const CsvControl: Function = ({
  onClick,
  disabled,
}: Props): React.Element<Controls> => (
  <Controls>
    <Control
      big
      text="Export CSV"
      iconName="export"
      disabled={disabled}
      onClick={onClick}
    />
  </Controls>
);

export default pure(CsvControl);
