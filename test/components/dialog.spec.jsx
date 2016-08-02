import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Dialog from '../../src/js/components/dialog';

describe('Dialog from \'components/dialog\'', () => {
  let originalGetElementById;
  const fakeElement = {
    offsetTop: 200,
    offsetLeft: 300,
    offsetHeight: 100,
    offsetWidth: 200,
  };

  let fakeDialog;

  beforeEach(() => {
    fakeDialog = {
      style: {
        left: '',
        top: '',
      },
    };

    originalGetElementById = document.getElementById;

    document.getElementById = name => {
      if (name.startsWith('dialog')) {
        return fakeDialog;
      }
      return fakeElement;
    };
  });

  afterEach(() => {
    document.getElementById = originalGetElementById;
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
    expect(
      wrapper.find('.dialog-wrapper').first().node.style.display
    ).to.equals('block');
  });

  it('Show dialog position bottom', () => {
    const wrapper = mount(
      <Dialog
        position="bottom"
        mainElement={<button>Open</button>}
      >
        <strong>test dialog</strong>
      </Dialog>
    );
    wrapper.find('button').simulate('click');

    expect(fakeDialog.style.top).to.equals('300px');
    expect(fakeDialog.style.left).to.equals('400px');
  });

  it('Show dialog position top', () => {
    const wrapper = mount(
      <Dialog
        position="top"
        mainElement={<button>Open</button>}
      >
        <strong>test dialog</strong>
      </Dialog>
    );
    wrapper.find('button').simulate('click');

    expect(fakeDialog.style.top).to.equals('200px');
    expect(fakeDialog.style.left).to.equals('400px');
  });

  it('Show dialog position left', () => {
    const wrapper = mount(
      <Dialog
        position="left"
        mainElement={<button>Open</button>}
      >
        <strong>test dialog</strong>
      </Dialog>
    );
    wrapper.find('button').simulate('click');

    expect(fakeDialog.style.top).to.equals('250px');
    expect(fakeDialog.style.left).to.equals('300px');
  });

  it('Show dialog position right', () => {
    const wrapper = mount(
      <Dialog
        position="right"
        mainElement={<button>Open</button>}
      >
        <strong>test dialog</strong>
      </Dialog>
    );
    wrapper.find('button').simulate('click');

    expect(fakeDialog.style.top).to.equals('250px');
    expect(fakeDialog.style.left).to.equals('500px');
  });
});
