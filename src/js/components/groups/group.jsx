/* @flow */
import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  name: string,
  size?: number,
  url?: string,
  disabled?: boolean,
};

const Group: Function = ({
  name,
  size,
  url,
  disabled,
}: Props): React.Element<any> => {
  const renderLabel: Function = (): React.Element<any> => (
    <span
      className={classNames({
        label: true,
        'label-info': !disabled,
      })}
    >
      {name}
      {typeof size !== 'undefined' && ' '}
      {typeof size !== 'undefined' && (
        <small>({size})</small>
      )}
    </span>
  );

  return (
    url ? (
      <span className="group">
        {renderLabel()}
      </span>
    ) : (
      <Link to={url} className="group">
        {renderLabel()}
      </Link>
    )
  );
};

export default pure([
  'name',
  'size',
  'url',
  'disabled',
])(Group);
