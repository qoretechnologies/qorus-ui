import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Dialog from '../../src/js/components/dialog';

describe('Dialog from \'components/dialog\'', () => {
  const rootEl = document.querySelector('#test-app');

  before(() => {
    Object.defineProperties(window.HTMLElement.prototype, {
      offsetLeft: { value: 300 },
      offsetTop: { value: 200 },
      offsetHeight: { value: 100 },
      offsetWidth: { value: 200 },
    });
  });

  it('Show dialog on click', () => {
    const wrapper = mount(
      <Dialog
        mainElement={<button>Open</button>}
      >
        <strong>test dialog</strong>
      </Dialog>
    );

    wrapper.find('button').simulate('click');
    expect(wrapper.find('.dialog-wrapper').length).to.equals(1);
  });

  it('Hide dialog on second click', () => {
    const wrapper = mount(
      <Dialog
        mainElement={<button>Open</button>}
      >
        <strong>test dialog</strong>
      </Dialog>
    );

    wrapper.find('button').simulate('click');
    wrapper.find('button').simulate('click');
    expect(wrapper.find('.dialog-wrapper').length).to.equals(0);
  });

  it('Hide on other element click', () => {
    const wrapper = mount(
      <div>
        <Dialog
          mainElement={<button>Open</button>}
        >
          <strong>test data</strong>
        </Dialog>
        <a id="something">something</a>
      </div>
    );

    wrapper.find('button').simulate('click');

    const event = document.createEvent('Event');
    event.initEvent('click', true, true);
    event.memo = {};

    const el = document.querySelector('body');
    el.dispatchEvent(event);
    expect(wrapper.find('.dialog-wrapper').length).to.equals(0);
  });

  it('Not hide on dialog element click', () => {
    const wrapper = mount(
      <div>
        <Dialog
          mainElement={<button>Open</button>}
        >
          <strong>test data</strong>
        </Dialog>
        <a id="something">something</a>
      </div>,
      { attachTo: rootEl }
    );

    wrapper.find('button').simulate('click');
    const event = document.createEvent('Event');
    event.initEvent('click', true, true);
    event.memo = {};

    const el = document.querySelector('strong');
    el.dispatchEvent(event);

    expect(wrapper.find('.dialog-wrapper').length).to.equals(1);
  });

  [
    { position: 'bottom', top: '300px', left: '400px' },
    { position: 'top', top: '200px', left: '400px' },
    { position: 'left', top: '250px', left: '300px' },
    { position: 'right', top: '250px', left: '500px' },
  ].forEach(item => {
    it(`Show dialog position ${item.position}`, () => {
      const wrapper = mount(
        <Dialog
          position={item.position}
          mainElement={<button>Open</button>}
        >
          <strong>test dialog</strong>
        </Dialog>,
        {
          attachTo: rootEl,
        }
      );
      wrapper.find('button').simulate('click');

      const dialogWrapper = document.querySelector('.dialog-wrapper');
      expect(dialogWrapper.style.top).to.equals(item.top);
      expect(dialogWrapper.style.left).to.equals(item.left);
    });
  });
});
