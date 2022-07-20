/* @flow */
import classNames from 'classnames';
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  url?: string;
  val: number | string;
  label: string;
  title?: string;
  className?: string;
  bypass: boolean;
};

const Badge: Function = ({
  url,
  val,
  label,
  title,
  className,
  bypass,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
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
