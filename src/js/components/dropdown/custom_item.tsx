/* @flow */
import React from 'react';

// @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
const CustomItem = ({ children }: { children: ?React.Element<*>}) => <li>{children}</li>;

export default CustomItem;
