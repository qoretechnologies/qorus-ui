// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { getType } from '../../helpers/functions';
import { Icon, Intent } from '@blueprintjs/core';
import Text from '../../components/text';
import Flex from '../Flex';

type ContentByTypeProps = {
  content: any,
  inTable?: boolean,
};

const emptyTypeToString: Object = {
  object: '{ }',
  array: '[ ]',
};

const ContentByType: Function = ({
  content,
  inTable,
}: ContentByTypeProps): React.Element<any> => {
  const type: string = getType(content);
  const className: string = `content-by-type ${type}`;

  if (type === 'string') {
    return inTable ? (
      <Flex className={className}>
        <Text text={`"${content}"`} />
      </Flex>
    ) : (
      <div className={className}>"{content}"</div>
    );
  }

  if (type === 'number') {
    return <div className={className}>{content}</div>;
  }

  if (type === 'object' || type === 'array') {
    return <div className={className}>{emptyTypeToString[type]}</div>;
  }

  if (type === 'boolean') {
    return (
      <div className={className}>
        <Icon
          iconName={content ? 'small-tick' : 'cross'}
          intent={content ? Intent.SUCCESS : Intent.DANGER}
        />
      </div>
    );
  }

  return <div className={className}>-</div>;
};

export default compose(onlyUpdateForKeys(['type']))(ContentByType);
