import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

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

      const wrapper = mount(<LibraryTab library={model.lib} />);
      expect(wrapper.find('.no-data')).to.have.length(1);
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

      const wrapper = mount(<LibraryTab library={lib} />);

      expect(wrapper.find('Item')).to.have.length(1);

      const itemProps = wrapper.find('Item').props();
      expect(itemProps.name).to.equal('test-lib');

      const codeProps = wrapper.find('Pane').props();
      expect(codeProps.active).to.be.true();

      const sourceCodeProps = wrapper.find('SourceCode').props();
      expect(sourceCodeProps.children.trim()).to.equal('sub TestCode() { printf("Empty"); }');
    });

    it('only main code', () => {
      const mainCode = 'sub TestCode() { printf("Empty"); }';

      const wrapper = mount(<LibraryTab mainCode={mainCode} />);

      expect(wrapper.find('Item')).to.have.length(1);

      const itemProps = wrapper.find('Item').props();
      expect(itemProps.name).to.equal('main_code');

      const codeProps = wrapper.find('Pane').props();
      expect(codeProps.active).to.be.true();

      const sourceCodeProps = wrapper.find('SourceCode').props();
      expect(sourceCodeProps.children.trim()).to.equal('sub TestCode() { printf("Empty"); }');
    });

    it('main code with funcs', () => {
      const mainCode = 'sub TestCode() { printf("Empty"); }';

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

      const wrapper = mount(<LibraryTab mainCode={mainCode} library={lib} />);

      expect(wrapper.find('Item')).to.have.length(2);

      const mainCodeProps = wrapper.find('Item').first().props();
      expect(mainCodeProps.active).to.be.true();

    });
  });
});
