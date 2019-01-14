import React from 'react';
import Flex from './Flex';

/**
 * Simple spinning loading indicator.
 *
 * @return {!ReactElement}
 */
export default function Loader() {
  return (
    <Flex style={{ margin: 10 }}>
      <Flex flexFlow="row" className="skeleton-loader">
        <Flex className="pt-skeleton" style={{ marginRight: 10 }} />
        <Flex className="pt-skeleton" flex="3 1 auto" />
        <Flex flex="8 1 auto" />
        <Flex className="pt-skeleton" flex="3 1 auto" />
      </Flex>
      <Flex className="pt-skeleton skeleton-loader" flex="2 1 auto" />
      <Flex className="pt-skeleton skeleton-loader" flex="14 1 auto" />
    </Flex>
  );
}
