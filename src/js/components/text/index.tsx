// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import ContentByType from '../ContentByType';
import Flex from '../Flex';
import Tree from '../tree';

type Props = {
  text: any;
  hasAlerts: boolean;
  expanded?: boolean;
  caseSensitiveTree: boolean;
  noMarkdown?: boolean;
};

const Text: Function = ({
  text,
  hasAlerts,
  expanded,
  caseSensitiveTree,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'noControls' does not exist on type 'Prop... Remove this comment to see the full error message
  noControls,
  noMarkdown,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> =>
  text && typeof text === 'object' ? (
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    <Tree data={text} noControls={noControls} caseSensitive={caseSensitiveTree} />
  ) : (
    <Flex flexFlow="row" title={text}>
      <div
        className={`text-component ${expanded && 'text-component-expanded'} ${
          hasAlerts && 'has-alerts'
        }`}
        title={text}
      >
        <ContentByType content={text} noMarkdown={noMarkdown} />
      </div>
    </Flex>
  );

export default compose(pure(['text', 'expanded', 'hasAlerts']))(Text);
