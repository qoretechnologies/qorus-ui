// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Flex from '../Flex';
import Tree from '../tree';
import ContentByType from '../ContentByType';

type Props = {
  text: any,
  hasAlerts: boolean,
  expanded?: boolean,
  caseSensitiveTree: boolean,
};

const Text: Function = ({
  text,
  hasAlerts,
  expanded,
  caseSensitiveTree,
}: Props): React.Element<any> =>
  text && typeof text === 'object' ? (
    <Tree data={text} caseSensitive={caseSensitiveTree} />
  ) : (
    <Flex flexFlow="row">
      <div
        className={`text-component ${expanded &&
          'text-component-expanded'} ${hasAlerts && 'has-alerts'}`}
        title={text}
      >
        <ContentByType content={text} />
      </div>
    </Flex>
  );

export default compose(pure(['text', 'expanded', 'hasAlerts']))(Text);
