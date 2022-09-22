// @flow
import { ReqorePanel, ReqorePopover } from '@qoretechnologies/reqore';
import { injectIntl } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import removeMd from 'remove-markdown';
import { Td, Th } from '../new_table';

type DescriptionColumnProps = {
  children: any;
  className: string;
  expanded?: boolean;
};

const DescriptionColumn: Function = compose(onlyUpdateForKeys(['children', 'expanded']))(
  ({
    children,
    className = 'text',
    expanded,
  }: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  DescriptionColumnProps) => (
    <Td className={className}>
      {children ? (
        <ReqorePopover
          noWrapper
          content={
            <ReqorePanel padded flat rounded>
              <ReactMarkdown>{children}</ReactMarkdown>
            </ReqorePanel>
          }
          component="span"
          placement="left"
        >
          <span
            style={{ display: 'inline-block', width: '100%', cursor: 'help', whiteSpace: 'nowrap' }}
          >
            {removeMd(children).replace(/\/n/g, ' ')}
          </span>
        </ReqorePopover>
      ) : (
        '-'
      )}
    </Td>
  )
);

type DescriptionColumnHeaderProps = {
  children: any;
  name: string;
  icon: string;
};

const DescriptionColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData']),
  injectIntl
)(
  ({
    children,
    name = 'desc',
    icon = 'label',
    // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Descriptio... Remove this comment to see the full error message
    intl,
    ...rest
  }: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  DescriptionColumnHeaderProps) => (
    <Th name={name} icon={icon} className="text" {...rest}>
      {children || intl.formatMessage({ id: 'table.description' })}
    </Th>
  )
);

export { DescriptionColumn, DescriptionColumnHeader };
