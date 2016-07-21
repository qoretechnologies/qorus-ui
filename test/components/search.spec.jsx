import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Search from '../../src/js/components/search';
import { Control } from '../../src/js/components/controls';

describe("Search from 'components/search'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Search', () => {
    it('renders search input with icon', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Search />
      );

      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('form');
      expect(result.props.children[0].type).to.equal('div');
      expect(result.props.children[1].type).to.equal(Control);
      expect(result.props.children[0].props.children[0].type).to.equal('input');
      expect(result.props.children[0].props.children[1].props.children.type).to.equal('i');
      expect(result.props.children[0].props.children[1].props.children.props.className)
        .to.equal('fa fa-search');
    });

    it('renders the input with a default value', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Search
          defaultValue="Yolo"
        />
      );

      const result = renderer.getRenderOutput();

      expect(result.props.children[0].props.children[0].props.defaultValue).to.equal('Yolo');
    });

    it('runs the provided function when the input changes after 500ms', () => {
      const action = chai.spy();
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Search
          onSearchUpdate={action}
        />
      );
      const result = renderer.getRenderOutput();

      result.props.children[0].props.children[0].props.onChange({
        target: { value: 'Hello' },
        persist: () => true,
      });

      setTimeout(() => {
        expect(action).to.have.been.called().with('Hello');
      }, 500);
    });

    it('renders the input wrapper without the pull-right class', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Search
          pullLeft
        />
      );

      const result = renderer.getRenderOutput();

      expect(result.props.children[0].props.className).to.equal('input-group col-lg-2 ');
    });
  });
});
