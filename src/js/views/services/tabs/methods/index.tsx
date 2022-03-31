// @flow
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../../components/box';
import MethodsTable from './table';

type Props = {
  service: any;
  methods: Array<Object>;
};

const MethodsTab: Function = ({
  service,
  methods,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Box fill noPadding top>
    <MethodsTable service={service} methods={methods} />
  </Box>
);

export default onlyUpdateForKeys(['service', 'methods'])(MethodsTab);
