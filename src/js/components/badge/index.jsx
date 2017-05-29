/* @flow */
import React from 'react';
import classNames from 'classnames';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  url?: string,
  val: number | string,
  label: string,
  title?: string,
  className?: string,
};

const Badge: Function = ({
  url,
  val,
  label,
  title,
  className,
}: Props): React.Element<any> => {
  const renderValue: Function = () => (
    <span
      title={title}
      className={classNames({
        badge: val || false,
        [`alert-${label}`]: label && val || false,
      }, val ? className : '')}
    >
      {val}
    </span>
  );

  return (
    url ? (
      <a title={title} href={url}>{renderValue()}</a>
    ) : (
      renderValue()
    )
  );
};

export default pure(['url', 'val', 'label', 'title', 'className'])(Badge);
