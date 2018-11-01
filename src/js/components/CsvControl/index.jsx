import React from 'react';

import { Controls, Control } from '../controls';
import pure from 'recompose/pure';

type Props = {
  onClick: Function,
};

const CsvControl: Function = ({ onClick }: Props): React.Element<Controls> => (
  <Controls>
    <Control big text="Export CSV" iconName="export" onClick={onClick} />
  </Controls>
);

export default pure(CsvControl);
