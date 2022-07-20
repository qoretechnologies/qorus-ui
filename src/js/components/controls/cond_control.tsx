/* @flow */
import omit from 'lodash/omit';
import React from 'react';
import showIfPassed from '../../hocomponents/show-if-passed';
import Control from './control';

type Props = {
  condition: Function;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const ConditionControl: Function = (props: Props) => <Control {...omit(props, 'condition')} />;

// @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default showIfPassed((props: any): boolean => props.condition(props))(ConditionControl);
