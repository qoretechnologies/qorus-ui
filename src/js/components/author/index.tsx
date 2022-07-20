// @flow
import { ReqorePanel } from '@qoretechnologies/reqore';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  model: any;
  author: string;
};

// @ts-ignore ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'.
const Author: Function = ({ model: { author } }: Props) =>
  author ? (
    <ReqorePanel flat rounded label="Author" icon="User2Line" padded>
      {author}
    </ReqorePanel>
  ) : null;

export default pure(['author'])(Author);
