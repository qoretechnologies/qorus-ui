import React from 'react';
import ReactDOM from 'react-dom';
// import { Link } from 'react-router';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

// import * as shallow from '../shallow';


import LibraryTab from '../../src/js/components/library';


describe("{ LibraryTab } from 'components/library'", () => {
  describe('LibraryTab', () => {
    it('displays empty library', () => {
      const model = {
        lib: {
          functions: [],
          classes: [],
          constants: [],
        },
      };

      const comp = TestUtils.renderIntoDocument(
        <LibraryTab library={model.lib} />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'p');

      expect(el.textContent.trim()).to.equal('Library not defined');
    });

    it('displays only functions with active test-lib nav and source code', () => {
      const lib = {
        functions: [
          {
            name: 'test-lib',
            version: '1.0',
            id: 1,
            body: 'sub TestCode() { printf("Empty"); }',
            function_type: 'GENERIC',
            description: 'Common library functions',
            author: 'Jane Doe',
            created: '2014-08-19 13:59:42.000000 Tue +02:00 (CEST)',
            modified: '2015-11-12 13:16:06.000000 Thu +01:00 (CET)',
            createdby: 'omq',
            modifiedby: 'omq',
            tags: {},
            source: '/at/my/home/test-libv1.0.qfd',
            offset: '7',
            host: 'spongebob',
            user: 'jdoe',
          },
        ],
        classes: [],
        constants: [],
      };

      const comp = TestUtils.renderIntoDocument(
        <LibraryTab library={lib} />
      );

      const compDOM = ReactDOM.findDOMNode(comp);

      const nav = compDOM.querySelector('a[data-target="func.test-lib"]');
      const navItems = compDOM
        .querySelector('div.well.well-sm > nav > ul[class="nav nav-pills nav-stacked"]');
      const code = compDOM.querySelector('div[id="func.test-lib"]');

      expect(navItems.children.length).to.equal(1);
      expect(nav.textContent.trim()).to.equal('test-lib');
      expect(code.className).to.equal('tab-pane active');
      expect(code.textContent.trim()).to.equal('sub TestCode() { printf("Empty"); }');
    });
  });
});
