// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Flex from '../../components/Flex';

type OAuthViewProps = {};

const OAuthView: Function = (props: OAuthViewProps): React.Element<any> => (
  <Flex>oAuth2 page in progress...</Flex>
);

export default compose(onlyUpdateForKeys([]))(OAuthView);
