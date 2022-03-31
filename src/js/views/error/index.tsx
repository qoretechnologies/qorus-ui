// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/la... Remove this comment to see the full error message
import { CenterWrapper } from '../../components/layout';

type Props = {};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const ErrorView: Function = ({}: Props) => <CenterWrapper>Error vid</CenterWrapper>;

export default pure(['children'])(ErrorView);
