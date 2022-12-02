/* @flow */
import compose from 'recompose/compose';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  className: string;
  children: any;
  colspan: number;
  title: string;
};

const Td: Function = ({
  colspan,
  className,
  children,
  title,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <td colSpan={colspan} className={className} title={title}>
    {children ?? '-'}
  </td>
);

export default compose(updateOnlyForKeys(['className', 'children', 'colspan', 'title']))(Td);
