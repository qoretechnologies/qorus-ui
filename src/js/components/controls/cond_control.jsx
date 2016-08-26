/* @flow */
import React from 'react';
import Control from './control';
import showIfPassed from '../../hocomponents/show-if-passed';
import omit from 'lodash/omit';

type Props = {
  condition: Function,
}

const ConditionControl: Function = (props: Props): React.Element<any> => (
  <Control {...omit(props, 'condition')} />
);

export default showIfPassed((props: Object): boolean => props.condition(props))(ConditionControl);
