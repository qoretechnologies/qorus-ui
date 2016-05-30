import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Editable from '../../src/js/components/editable';
import { Control as Button } from '../../src/js/components/controls';

describe("Editable from 'components/editable'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Date', () => {
    it('renders the header with the provided text prop', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Editable text="Hello" />
      );

      const result = renderer.getRenderOutput();

      expect(result.type).to.equal('h3');
      expect(result.props.children).to.equal('Hello');
    });

    it('renders an input with 2 buttons and the text when the header is clicked', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Editable
          text="Hello"
          value="Another hello"
        />
      );

      let result = renderer.getRenderOutput();

      result.props.onClick();

      result = renderer.getRenderOutput();

      expect(result.type).to.equal('form');
      expect(result.props.children.type).to.equal('div');
      expect(result.props.children.props.children[0].type).to.equal('input');
      expect(result.props.children.props.children[0].props.defaultValue).to.equal('Another hello');
      expect(result.props.children.props.children[1].props.children[0].type).to.equal(Button);
      expect(result.props.children.props.children[1].props.children[1].type).to.equal(Button);
    });

    it('renders an input with the provided type', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Editable
          text="Hello"
          value="2"
          type="number"
        />
      );

      let result = renderer.getRenderOutput();

      result.props.onClick();

      result = renderer.getRenderOutput();

      expect(result.props.children.props.children[0].props.type).to.equal('number');
    });

    it('renders the text again when cancel is clicked', () => {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Editable
          text="Hello"
          value="Hello"
        />
      );

      let result = renderer.getRenderOutput();

      result.props.onClick();

      result = renderer.getRenderOutput();

      result.props.children.props.children[1].props.children[1].props.action();

      result = renderer.getRenderOutput();

      expect(result.type).to.equal('h3');
    });

    it('runs the provided function when submitted', () => {
      const action = chai.spy();
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Editable
          text="Hello"
          value="Hello"
          onSubmit={action}
        />
      );

      let result = renderer.getRenderOutput();

      result.props.onClick();

      result = renderer.getRenderOutput();

      result.props.children.props.children[0].props.onChange({ target: { value: 'Its me' } });
      result.props.onSubmit({ preventDefault: () => true });

      expect(action).to.have.been.called().with('Its me');
    });

    it('doesnt run the provided function when the error checker fails', () => {
      const action = chai.spy();
      const errorChecker = (value) => value < 10;
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Editable
          text="Hello"
          value="Hello"
          onSubmit={action}
          errorChecker={errorChecker}
        />
      );

      let result = renderer.getRenderOutput();

      result.props.onClick();

      result = renderer.getRenderOutput();

      result.props.children.props.children[0].props.onChange({ target: { value: 11 } });
      result.props.onSubmit({ preventDefault: () => true });

      result = renderer.getRenderOutput();

      expect(action).to.have.not.been.called();
      expect(result.props.children.props.children[0].props.className).to.equal('form-control form-error');
    });

    it('runs the provided function when the error checker succeeds', () => {
      const action = chai.spy();
      const errorChecker = (value) => value < 10;
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <Editable
          text="Hello"
          value="Hello"
          onSubmit={action}
          errorChecker={errorChecker}
        />
      );

      let result = renderer.getRenderOutput();

      result.props.onClick();

      result = renderer.getRenderOutput();

      result.props.children.props.children[0].props.onChange({ target: { value: 5 } });
      result.props.onSubmit({ preventDefault: () => true });

      expect(action).to.have.been.called().with(5);
    });
  });
});
