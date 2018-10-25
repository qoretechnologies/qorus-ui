import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import classnames from 'classnames';

type Props = {
  right?: boolean,
  tag?: string,
  Tag: string,
  children: React.Element<any>,
  className?: string,
};

const Pull: Function = ({
  right,
  Tag,
  children,
  className,
}: Props): React.Element<HTMLElement> => (
  <Tag className={classnames(className, `pull-${right ? 'right' : 'left'}`)}>
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
