// @flow
import { ReqoreIcon } from '@qoretechnologies/reqore';
import ReactMarkdown from 'react-markdown';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Date from '../../components/date';
import Text from '../../components/text';
import { isDate } from '../../helpers/date';
import { getType } from '../../helpers/functions';
import Flex from '../Flex';

type ContentByTypeProps = {
  content: any;
  inTable?: boolean;
  noMarkdown?: Boolean;
};

const emptyTypeToString: any = {
  object: '{ }',
  array: '[ ]',
};

const ContentByType: Function = ({
  content,
  inTable,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'noControls' does not exist on type 'Cont... Remove this comment to see the full error message
  noControls,
  noMarkdown,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'inline' does not exist on type 'ContentB... Remove this comment to see the full error message
  inline,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'baseType' does not exist on type 'Conten... Remove this comment to see the full error message
  baseType,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ContentByTypeProps) => {
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
        <ReqoreIcon
          icon={content ? 'CheckLine' : 'CloseLine'}
          color={content ? '#0070f3' : '#f30000'}
        />
      </div>
    );
  }

  if (type === 'object' || type === 'array') {
    return <div className={className}>{emptyTypeToString[type]}</div>;
  }

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
