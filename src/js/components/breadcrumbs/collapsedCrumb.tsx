// @flow
import { ReqoreDropdown } from '@qoretechnologies/reqore';
import map from 'lodash/map';
import { browserHistory } from 'react-router';

type Props = {
  links: any;
};

const CollapsedCrumb: Function = ({ links }: Props) => (
  <ReqoreDropdown
    items={map(links, (link, name) => ({
      label: name,
      onClick: () => browserHistory.push(link),
    }))}
  />
);

export default CollapsedCrumb;
