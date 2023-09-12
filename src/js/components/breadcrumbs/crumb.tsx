// @flow
import { ReqoreButton, ReqoreIcon } from '@qoretechnologies/reqore';
import { Link } from 'react-router';

type Props = {
  link?: string;
  disabled?: boolean;
  children?: any;
  text?: string;
  active?: boolean;
  icon?: string;
};

const Crumb: Function = ({
  link,
  disabled,
  text,
  children,
  active,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <>
    <ReqoreIcon icon="ArrowRightSLine" />
    {link ? (
      <ReqoreButton as={Link} active={active} disabled={disabled} to={link} flat>
        {text || children}
      </ReqoreButton>
    ) : (
      <ReqoreButton active={active} disabled={disabled} flat>
        {text || children}
      </ReqoreButton>
    )}
  </>
);

export default Crumb;
