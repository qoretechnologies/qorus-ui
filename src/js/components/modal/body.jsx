/* @flow */
import React from 'react';
import Flex from '../Flex';

/**
 * Wrapper for modal main content.
 *
 * @param {!{ children: ReactNode }} props
 * @return {!ReactElement}
 */
export default function Body(props: { children: any }) {
  return <Flex className="pt-dialog-body">{props.children}</Flex>;
}
