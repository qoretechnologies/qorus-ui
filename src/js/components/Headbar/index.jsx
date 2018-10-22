import React from 'react';
import compose from 'recompose/compose';

type Props = {
  children: Array<React.Element<any>>,
};

const Headbar: Function = ({ children }: Props): React.Element<any> => (
  <div className="headbar">{children}</div>
);

export default compose()(Headbar);
