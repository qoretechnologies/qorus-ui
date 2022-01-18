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
import { getUrlFromProvider } from '../DataproviderSelector';
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

  // If the type is data-provider get the provider url from the value and render the provider
  if (type === 'data-provider') {
    const url = getUrlFromProvider(content);

    return inTable ? (
      <Flex className={className} title={content}>
        {url}
      </Flex>
    ) : (
      <div className={className}>{url}</div>
    );
  }

  if (type === 'null') {
    return (
      <div
        className={className}
        style={{ opacity: 0.7, color: '#a9a9a9', fontStyle: 'italic' }}
      >
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
