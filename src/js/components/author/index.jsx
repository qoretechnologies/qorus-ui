// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Icon from '../icon';

type Props = {
  model: Object,
  author: string,
  small?: boolean,
};

const Author: Function = ({
  model: { author },
  small,
}: Props): ?React.Element<any> =>
  author ? (
    <div>
      {small ? (
        <p>
          <strong>Author</strong>
        </p>
      ) : (
        <h4>Author</h4>
      )}
      <p>
        <Icon icon="user" /> {author}
      </p>
    </div>
  ) : null;

export default pure(['author'])(Author);
