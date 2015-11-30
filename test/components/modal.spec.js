import '../jsdom';
import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Modal from '../../src/js/components/modal';


describe("Modal from 'compnents/modal'", () => {
  it('renders nothing unless #open is called', () => {
    const modal = TestUtils.renderIntoDocument(
      <Modal />
    );

    expect(modal.props.children).to.be.an('undefined');
  });


  /**
   * Example component providing method to render modal pane content.
   */
  class Client extends Component {
    renderModal() { return 'Rendered in modal'; }
    render() { return null; }
  }


  describe('#open', () => {
    it('renders Bootstrap modal with backdrop', () => {
      const modal = TestUtils.renderIntoDocument(
        <Modal />
      );
      const client = TestUtils.renderIntoDocument(
        <Client />
      );


      modal.open(client, client.renderModal);


      const modalDom = TestUtils.findRenderedDOMComponentWithClass(
        modal, 'modal'
      );
      expect(modalDom.firstChild.className).
        to.equal('modal-dialog');
      expect(modalDom.firstChild.firstChild.data).
        to.equal('Rendered in modal');


      TestUtils.findRenderedDOMComponentWithClass(
        modal, 'modal-backdrop'
      );
    });
  });


  describe('#close', () => {
    it('hides modal and backdrop', () => {
      const modal = TestUtils.renderIntoDocument(
        <Modal />
      );
      const client = TestUtils.renderIntoDocument(
        <Client />
      );


      modal.open(client, client.renderModal);
      modal.close(client);


      const modalDom = TestUtils.scryRenderedDOMComponentsWithClass(
        modal, 'modal'
      );
      expect(modalDom).to.have.length(0);


      const backdropDom = TestUtils.scryRenderedDOMComponentsWithClass(
        modal, 'modal-backdrop'
      );
      expect(backdropDom).to.have.length(0);
    });
  });
});
