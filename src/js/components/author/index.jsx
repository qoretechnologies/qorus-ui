// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Icon from '../icon';

type Props = {
  model: Object,
  author: string,
};

const Author: Function = ({ model: { author } }: Props): ?React.Element<any> => (
  author ?
    <div>
      <h4>Author</h4>
      <p><Icon icon="user" /> {author}</p>
    </div> :
    null
);

export default pure(['author'])(Author);
