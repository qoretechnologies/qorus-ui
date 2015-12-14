import '../jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import Handle from '../../src/js/components/resize/handle';


describe("Handle from 'components/resize/handle'", () => {
  let mountNode;

  beforeEach(() => {
    mountNode = document.createElement('DIV');
    document.body.appendChild(mountNode);
  });

  afterEach(() => {
    document.body.removeChild(mountNode);
  });


  it('resizes parent element when dragged', () => {
    const resizable = ReactDOM.render((
      <div style={{ position: 'absolute', left: '0px', width: '100px' }}>
        <Handle right />
      </div>
    ), mountNode);
    const moveEv = new window.MouseEvent('mousemove', { clientX: 80 });
    const upEv = new window.MouseEvent('mouseup');


    TestUtils.Simulate.mouseDown(resizable.firstElementChild);
    document.dispatchEvent(moveEv);
    resizable.firstElementChild.dispatchEvent(upEv);


    expect(resizable.style.width).to.equal('80px');
  });


  // JSDOM cannot compute bouding border box which is required for
  // this to work
  xit('limits dragging to initial dimension when minCurrent is set', () => {
    const resizable = ReactDOM.render((
      <div style={{ position: 'absolute', left: '0px', width: '100px' }}>
        <Handle right minCurrent />
      </div>
    ), mountNode);
    const moveEv = new window.MouseEvent('mousemove', { clientX: 80 });
    const upEv = new window.MouseEvent('mouseup');


    TestUtils.Simulate.mouseDown(resizable.firstElementChild);
    document.dispatchEvent(moveEv);
    resizable.firstElementChild.dispatchEvent(upEv);


    expect(resizable.style.width).to.equal('100px');
  });


  it('sets min class when minimal dimensions are reached', () => {
    const resizable = ReactDOM.render((
      <div style={{ position: 'absolute', left: '0px', width: '100px' }}>
        <Handle right minCurrent />
      </div>
    ), mountNode);


    expect(Array.from(resizable.firstElementChild.classList)).to.include('min');
  });
});
