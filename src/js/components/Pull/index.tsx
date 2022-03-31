import classnames from 'classnames';
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  right?: boolean;
  tag?: string;
  Tag: string;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  children: React.Element<any>;
  className?: string;
  handleRef: Function;
  style?: Object;
};

const Pull: Function = ({
  right,
  Tag,
  children,
  className,
  handleRef,
  style,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<HTMLElement> => (
  // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: any; className: string; ref: Fun... Remove this comment to see the full error message
  <Tag
    className={classnames(className, `pull-${right ? 'right' : 'left'}`)}
    ref={handleRef}
    style={style}
  >
    {children}
  </Tag>
);

export default compose(
  mapProps(
    ({ tag, ...rest }: Props): Props => ({
      Tag: tag || 'div',
      ...rest,
    })
  ),
  onlyUpdateForKeys(['left', 'right', 'tag', 'Tag', 'children'])
)(Pull);
