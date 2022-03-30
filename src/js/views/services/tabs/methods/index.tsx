// @flow
import React from 'react';
import MethodsTable from './table';
import Box from '../../../../components/box';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  service: Object,
  methods: Array<Object>,
};

const MethodsTab: Function = ({
  service,
  methods,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<Box> => (
  <Box fill noPadding top>
    <MethodsTable service={service} methods={methods} />
  </Box>
);

export default onlyUpdateForKeys(['service', 'methods'])(MethodsTab);
