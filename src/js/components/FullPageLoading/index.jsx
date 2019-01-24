// @flow
import React from 'react';
import { Navbar, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
import Flex from '../Flex';
import Loader from '../loader';

const FullPageLoading: Function = (): React.Element<any> => (
  <div className="root">
    <Navbar className="pt-fixed-top pt-dark topbar">
      <Flex flexFlow="row" height="100%">
        <Flex
          className="pt-skeleton"
          flex="5 1 auto"
          style={{ margin: '10px 5px' }}
        />
        <Flex flex="25 1 auto" />
        <Flex
          className="pt-skeleton"
          flex="6 1 auto"
          style={{ margin: '10px 5px' }}
        />
        <NavbarGroup>
          <NavbarDivider />
        </NavbarGroup>
        <Flex
          className="pt-skeleton"
          flex="1 1 auto"
          style={{ margin: '10px 5px' }}
        />
        <Flex
          className="pt-skeleton"
          flex="1 1 auto"
          style={{ margin: '10px 5px' }}
        />
        <Flex
          className="pt-skeleton"
          flex="1 1 auto"
          style={{ margin: '10px 5px' }}
        />
        <Flex
          className="pt-skeleton"
          flex="1 1 auto"
          style={{ margin: '10px 5px' }}
        />
        <NavbarGroup>
          <NavbarDivider />
        </NavbarGroup>
        <Flex
          className="pt-skeleton"
          flex="1 1 auto"
          style={{ margin: '10px 5px' }}
        />
      </Flex>
    </Navbar>
    <div className="root__center">
      <div className="pt-dark">
        <div className="pt-menu sidebar">
          <Flex height="100%">
            <Flex
              className="pt-skeleton"
              flex="1 1 auto"
              style={{ margin: '5px' }}
            />
            <Flex
              className="pt-skeleton"
              flex="1 1 auto"
              style={{ margin: '5px' }}
            />
            <Flex
              className="pt-skeleton"
              flex="1 1 auto"
              style={{ margin: '5px' }}
            />
            <Flex
              className="pt-skeleton"
              flex="1 1 auto"
              style={{ margin: '5px' }}
            />
            <Flex
              className="pt-skeleton"
              flex="1 1 auto"
              style={{ margin: '5px' }}
            />
            <Flex
              className="pt-skeleton"
              flex="1 1 auto"
              style={{ margin: '5px' }}
            />
            <Flex
              className="pt-skeleton"
              flex="1 1 auto"
              style={{ margin: '5px' }}
            />
            <Flex flex="20 1 auto" style={{ margin: '5px' }} />
          </Flex>
        </div>
      </div>
      <Flex className="section" scrollX>
        <Flex style={{ minWidth: 1024 }}>
          <Loader />
        </Flex>
      </Flex>
    </div>
    <footer />
  </div>
);

export default FullPageLoading;
