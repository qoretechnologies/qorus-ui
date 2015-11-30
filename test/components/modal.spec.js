import '../jsdom';
import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Modal from '../../src/js/components/modal';


describe("Modal from 'components/modal'", () => {
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
    /**
     * Placeholder method to be used to observe modal close.
     */
    onModalClose() {}

    renderModal() {
      return (
        <Modal.Content>
          <Modal.Header
            titleId='modalTitle'
            onClose={() => { this.onModalClose(); }}
          />
          <Modal.Body>
            <p>Rendered in modal</p>
          </Modal.Body>
          <Modal.Footer />
        </Modal.Content>
      );
    }

    render() {
      return null;
    }
  }


  /**
   * Checks if modal is closed.
   *
   * @param {ReactComponent} modal
   */
  function expectModalToBeClosed(modal) {
    const modalDom = TestUtils.scryRenderedDOMComponentsWithClass(
      modal, 'modal'
    );
    expect(modalDom).to.have.length(0);


    const backdropDom = TestUtils.scryRenderedDOMComponentsWithClass(
      modal, 'modal-backdrop'
    );
    expect(backdropDom).to.have.length(0);
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
      const modalBodyDom = TestUtils.findRenderedDOMComponentWithClass(
        modal, 'modal-body'
      );
      expect(modalBodyDom.firstChild.firstChild.data).
        to.equal('Rendered in modal');


      TestUtils.findRenderedDOMComponentWithClass(
        modal, 'modal-backdrop'
      );
    });

    it("sets aria-labelledby to reference Header's prop titleId", () => {
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
      expect(modalDom.getAttribute('aria-labelledby')).to.equal('modalTitle');
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


      expectModalToBeClosed(modal);
    });
  });


  describe('#onEscape', () => {
    it('listens on whole document for Escape key press', () => {
      const modal = TestUtils.renderIntoDocument(
        <Modal />
      );
      const client = TestUtils.renderIntoDocument(
        <Client />
      );
      const escKeyEv = new window.Event('keyup');
      escKeyEv.keyCode = 27;


      modal.open(client, client.renderModal);
      client.onModalClose = modal.close.bind(modal, client);
      document.dispatchEvent(escKeyEv);


      const modalDom = TestUtils.scryRenderedDOMComponentsWithClass(
        modal, 'modal'
      );
      expect(modalDom).to.have.length(0);
    });
  });


  describe('Modal.Header', () => {
    it('renders close button when onClose handler if specified', () => {
      const modal = TestUtils.renderIntoDocument(
        <Modal />
      );
      const client = TestUtils.renderIntoDocument(
        <Client />
      );


      modal.open(client, client.renderModal);
      client.onModalClose = modal.close.bind(modal, client);
      const modalHeaderDom = TestUtils.findRenderedDOMComponentWithClass(
        modal, 'modal-header'
      );
      TestUtils.Simulate.click(modalHeaderDom.firstChild);


      expectModalToBeClosed(modal);
    });
  });
});
