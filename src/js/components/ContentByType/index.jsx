// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { getType } from '../../helpers/functions';
import { Icon, Intent } from '@blueprintjs/core';
import Text from '../../components/text';
import Date from '../../components/date';
import Flex from '../Flex';
import { isDate } from '../../helpers/date';
import ReactMarkdown from 'react-markdown';

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
}: ContentByTypeProps): React.Element<any> => {
  const type: string = getType(content);
  const className: string = `content-by-type ${type} ${inline ? 'inline' : ''}`;

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

  if (type === 'string') {
    const isContentDate: boolean = isDate(content);

    let newContent = inTable ? (
      <Text text={content} noControls={noControls} />
    ) : (
      content
    );
    newContent = isContentDate ? <Date date={content} /> : newContent;

    return inTable ? (
      <Flex className={className} title={content}>
        {newContent}
      </Flex>
    ) : (
      <div className={className} title={newContent}>
        {noMarkdown ? newContent : <ReactMarkdown>{newContent}</ReactMarkdown>}
      </div>
    );
  }

  if (type === 'number') {
    return <div className={className}>{content}</div>;
  }

  if (type === 'object' || type === 'array') {
    return <div className={className}>{emptyTypeToString[type]}</div>;
  }

  return <div className={className}>-</div>;
};

export default compose(onlyUpdateForKeys(['type', 'content']))(ContentByType);
