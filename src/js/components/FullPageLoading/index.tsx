// @flow
import { Navbar, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
import Flex from '../Flex';
import Loader from '../loader';

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const FullPageLoading: Function = () => (
  <div className="root">
    <Navbar className="bp3-fixed-top bp3-dark topbar">
      <Flex flexFlow="row" height="100%">
        <Flex className="bp3-skeleton" flex="5 1 auto" style={{ margin: '10px 5px' }} />
        <Flex flex="25 1 auto" />
        <Flex className="bp3-skeleton" flex="6 1 auto" style={{ margin: '10px 5px' }} />
        <NavbarGroup>
          <NavbarDivider />
        </NavbarGroup>
        <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '10px 5px' }} />
        <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '10px 5px' }} />
        <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '10px 5px' }} />
        <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '10px 5px' }} />
        <NavbarGroup>
          <NavbarDivider />
        </NavbarGroup>
        <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '10px 5px' }} />
      </Flex>
    </Navbar>
    <div className="root__center">
      <div className="bp3-dark">
        <div className="bp3-menu sidebar">
          <Flex height="100%">
            <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '5px' }} />
            <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '5px' }} />
            <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '5px' }} />
            <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '5px' }} />
            <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '5px' }} />
            <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '5px' }} />
            <Flex className="bp3-skeleton" flex="1 1 auto" style={{ margin: '5px' }} />
            <Flex flex="20 1 auto" style={{ margin: '5px' }} />
          </Flex>
        </div>
      </div>
      <Flex className="section" scrollX>
        <Flex>
          <Loader />
        </Flex>
      </Flex>
    </div>
    <footer />
  </div>
);

export default FullPageLoading;
