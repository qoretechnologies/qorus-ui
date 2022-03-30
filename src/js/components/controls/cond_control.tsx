/* @flow */
import React from 'react';
import Control from './control';
import showIfPassed from '../../hocomponents/show-if-passed';
import omit from 'lodash/omit';

type Props = {
  condition: Function,
}

// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const ConditionControl: Function = (props: Props): React.Element<any> => (
  <Control {...omit(props, 'condition')} />
);

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default showIfPassed((props: Object): boolean => props.condition(props))(ConditionControl);
