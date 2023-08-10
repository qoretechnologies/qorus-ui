import { ReqoreMessage } from '@qoretechnologies/reqore';
import Flex from './Flex';

export interface ILoaderProps {
  error?: any;
}

export default function Loader({ error }: ILoaderProps) {
  if (error) {
    return (
      <ReqoreMessage title="Error" intent="danger">
        Unable to load this view, please check the console.
      </ReqoreMessage>
    );
  }

  return (
    <Flex style={{ margin: 10 }}>
      <Flex flexFlow="row" className="skeleton-loader">
        <Flex className="bp3-skeleton" style={{ marginRight: 10 }} />
        <Flex className="bp3-skeleton" flex="3 1 auto" />
        <Flex flex="8 1 auto" />
        <Flex className="bp3-skeleton" flex="3 1 auto" />
      </Flex>
      <Flex className="bp3-skeleton skeleton-loader" flex="2 1 auto" />
      <Flex className="bp3-skeleton skeleton-loader" flex="14 1 auto" />
    </Flex>
  );
}
