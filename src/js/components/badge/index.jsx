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
  bypass: boolean,
};

const Badge: Function = ({
  url,
  val,
  label,
  title,
  className,
  bypass,
}: Props): React.Element<any> => {
  const renderValue: Function = () => (
    <span
      title={title}
      className={classNames(
        {
          badge: val || bypass || false,
          [`alert-${label}`]: (label && (val || bypass)) || false,
        },
        val || bypass ? className : ''
      )}
    >
      {val}
    </span>
  );

  return url ? (
    <a title={title} href={url}>
      {renderValue()}
    </a>
  ) : (
    renderValue()
  );
};

export default pure(['url', 'val', 'label', 'title', 'className'])(Badge);
