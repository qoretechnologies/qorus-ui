// @flow
import { Icon, Intent } from '@blueprintjs/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Date from '../../components/date';
import Text from '../../components/text';
import { isDate } from '../../helpers/date';
import { getType } from '../../helpers/functions';
import Flex from '../Flex';

type ContentByTypeProps = {
  content: any,
  inTable?: boolean,
  noMarkdown?: Boolean,
};

const emptyTypeToString: Object = {
  object: '{ }',
  array: '[ ]',
};

const ContentByType: Function = ({
  content,
  inTable,
  noControls,
  noMarkdown,
  inline,
  baseType,
}: ContentByTypeProps): React.Element<any> => {
  const type: string = baseType || getType(content);
  const className: string = `content-by-type ${type} ${inline ? 'inline' : ''}`;

  if (type === 'null') {
    return (
      <div className={className} style={{ opacity: 0.7, color: '#a9a9a9', fontStyle: 'italic' }}>
        null
      </div>
    );
  }

  if (type === 'boolean') {
    return (
      <div className={className}>
        <Icon
          icon={content ? 'small-tick' : 'cross'}
          intent={content ? Intent.SUCCESS : Intent.DANGER}
        />
      </div>
    );
  }

  if (type === 'object' || type === 'array') {
    return <div className={className}>{emptyTypeToString[type]}</div>;
  }

  console.log(type, content);

  if (
    type !== 'number' &&
    (type === 'string' ||
      new Date(content).toString() !== 'Invalid Date' ||
      type === 'data-provider')
  ) {
    const isContentDate: boolean = isDate(content);

    let newContent = inTable ? <Text text={content} noControls={noControls} /> : content;
    newContent = isContentDate ? <Date date={content} /> : newContent;

    return inTable ? (
      <Flex className={className} title={content}>
        {newContent}
      </Flex>
    ) : (
      <div className={className} title={newContent}>
        {noMarkdown || isContentDate ? (
          newContent
        ) : (
          <ReactMarkdown>{newContent.toString()}</ReactMarkdown>
        )}
      </div>
    );
  }

  if (type === 'number') {
    return <div className={className}>{content}</div>;
  }

  return <div className={className}>-</div>;
};

export default compose(onlyUpdateForKeys(['type', 'content']))(ContentByType);
