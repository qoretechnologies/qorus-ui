import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import Navigation from '../../src/js/components/navigation.js';


describe('Testing Navigation Component', function () {
  const props = {
    mainItems: [{
      url: '/workflows',
      name: 'Workflows',
      className: 'workflow',
      icon: 'icon-sitemap'
    }],
    extraItems: []
  };

  const nodeEl = TestUtils.renderIntoDocument(
    <Navigation {...props} />
  );

  const listNode = TestUtils.scryRenderedDOMComponentsWithTag(nodeEl, 'ul');
  const firstEl = listNode[0];

  it('main nav should contains 1 children', function () {
    expect(firstEl.childNodes).to.have.length(1);
  });

  it('main nav first item should contain text: Workflows', function () {
    expect(firstEl.firstChild.textContent.trim())
    .to.equal('Workflows');
  });

  it('main nav first item should have className: workflow', function () {
    expect(firstEl.firstChild.className)
      .to.have.string('workflow');
  });

  it('main nav first icon should have className: icon-sitemap', function () {
    expect(firstEl.getElementsByTagName('i')[0].className)
      .to.have.string('icon-sitemap');
  });
});
