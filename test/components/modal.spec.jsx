import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Modal, { Manager } from '../../src/js/components/modal';


describe("Modal, { Manager } from 'components/modal'", () => {
  /**
   * Example modal component with simple content.
   */
  class SimpleModal extends Component {
    static propTypes = {
      heading: PropTypes.string,
      onClose: PropTypes.func,
    };

    render() {
      return (
        <Modal>
          <Modal.Header
            titleId="modalTitle"
            onClose={this.props.onClose}
          >
            {this.props.heading}
          </Modal.Header>
          <Modal.Body>
            <p>Rendered in modal</p>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      );
    }
  }


  /**
   * Checks if modal is closed.
   *
   * @param {ReactComponent} manager
   */
  function expectModalToBeClosed(manager) {
    const modalDom = TestUtils.scryRenderedDOMComponentsWithClass(
      manager, 'modal'
    );
    expect(modalDom).to.have.length(0);


    const backdropDom = TestUtils.scryRenderedDOMComponentsWithClass(
      manager, 'modal-backdrop'
    );
    expect(backdropDom).to.have.length(0);
  }


  /**
   * Checks if simple modal is opened.
   *
   * @param {ReactComponent} manager
   */
  function expectSimpleModalToBeOpened(manager) {
    const modalDom = TestUtils.findRenderedDOMComponentWithClass(
      manager, 'modal'
    );
    expect(modalDom.firstChild.className).
      to.equal('modal-dialog');
    const modalBodyDom = TestUtils.findRenderedDOMComponentWithClass(
      manager, 'modal-body'
    );
    expect(modalBodyDom.firstChild.firstChild.data).
      to.equal('Rendered in modal');


    TestUtils.findRenderedDOMComponentWithClass(
      manager, 'modal-backdrop'
    );
  }


  describe('Manager', () => {
    it('renders nothing until #open is called', () => {
      const manager = TestUtils.renderIntoDocument(
        <Manager />
      );

      expect(manager.props.children).to.be.an('undefined');
    });


    describe('#open', () => {
      it('renders Bootstrap modal with backdrop', () => {
        const manager = TestUtils.renderIntoDocument(
          <Manager />
        );
        const modal = <SimpleModal />;


        manager.open(modal);


        expectSimpleModalToBeOpened(manager);
      });


      it('replaces previous modal with a new one if called consecutively',
      () => {
        const manager = TestUtils.renderIntoDocument(
          <Manager />
        );
        const modal1 = <SimpleModal heading="first" />;
        const modal2 = <SimpleModal heading="second" />;


        manager.open(modal1);
        manager.open(modal2);


        expectSimpleModalToBeOpened(manager);
        const modalTitleDom = TestUtils.findRenderedDOMComponentWithClass(
          manager, 'modal-title'
        );
        expect(modalTitleDom.firstChild.data).to.equal('second');
      });
    });


    describe('#close', () => {
      it('hides modal and backdrop', () => {
        const manager = TestUtils.renderIntoDocument(
          <Manager />
        );
        const modal = <SimpleModal />;


        manager.open(modal);
        manager.close(modal);


        expectModalToBeClosed(manager);
      });


      it('opens previously opened but not closed modal', () => {
        const manager = TestUtils.renderIntoDocument(
          <Manager />
        );
        const modal1 = <SimpleModal heading="first" />;
        const modal2 = <SimpleModal heading="second" />;


        manager.open(modal1);
        manager.open(modal2);
        manager.close(modal2);


        expectSimpleModalToBeOpened(manager);
        const modalTitleDom = TestUtils.findRenderedDOMComponentWithClass(
          manager, 'modal-title'
        );
        expect(modalTitleDom.firstChild.data).to.equal('first');


        manager.close(modal1);


        expectModalToBeClosed(manager);
      });
    });


    describe('#onEscape', () => {
      context('modifies DOM outside of component', () => {
        let mountNode;

        beforeEach(() => {
          mountNode = document.createElement('DIV');
          document.body.appendChild(mountNode);
        });

        afterEach(() => {
          document.body.removeChild(mountNode);
        });

        it("handles Escape key press by triggering modal's close button",
        () => {
          const manager = ReactDOM.render(<Manager />, mountNode);

          let modal;
          const onClose = () => manager.close(modal);
          modal = (
            <SimpleModal onClose={onClose} />
          );
          const escKeyEv = new window.KeyboardEvent('keyup', { keyCode: 27 });


          manager.open(modal);
          document.dispatchEvent(escKeyEv);


          const modalDom = TestUtils.scryRenderedDOMComponentsWithClass(
            manager, 'modal'
          );
          expect(modalDom).to.have.length(0);


          ReactDOM.unmountComponentAtNode(mountNode);
        });
      });
    });
  });


  describe('Modal', () => {
    it("calls Header's `onClose` prop when captures click outside modal dialog",
    () => {
      const manager = TestUtils.renderIntoDocument(
        <Manager />
      );

      let modal;
      const onClose = () => manager.close(modal);
      modal = (
        <SimpleModal onClose={onClose} />
      );


      manager.open(modal);


      const modalDom = TestUtils.findRenderedDOMComponentWithClass(
        manager, 'modal'
      );


      TestUtils.Simulate.click(modalDom);


      expectModalToBeClosed(manager);
    });
  });


  describe('Modal.Header', () => {
    it('renders no close button if there is no onClose handler', () => {
      const manager = TestUtils.renderIntoDocument(
        <Manager />
      );
      const modal = (
        <SimpleModal />
      );


      manager.open(modal);


      const modalHeaderDom = TestUtils.findRenderedDOMComponentWithClass(
        manager, 'modal-header'
      );
      expect(modalHeaderDom.firstChild).to.be.a('null');
    });


    it('renders close button if onClose handler is specified', () => {
      const manager = TestUtils.renderIntoDocument(
        <Manager />
      );

      let modal;
      const onClose = () => manager.close(modal);
      modal = (
        <SimpleModal onClose={onClose} />
      );


      manager.open(modal);


      const modalHeaderDom = TestUtils.findRenderedDOMComponentWithClass(
        manager, 'modal-header'
      );
      expect(modalHeaderDom.firstChild.tagName).to.equal('BUTTON');
      expect(modalHeaderDom.firstChild.className).to.equal('close');


      TestUtils.Simulate.click(modalHeaderDom.firstChild);


      expectModalToBeClosed(manager);
    });


    it('renders close button calling onClose handler', () => {
      const manager = TestUtils.renderIntoDocument(
        <Manager />
      );

      let modal;
      const onClose = () => manager.close(modal);
      modal = (
        <SimpleModal onClose={onClose} />
      );


      manager.open(modal);


      const modalHeaderDom = TestUtils.findRenderedDOMComponentWithClass(
        manager, 'modal-header'
      );
      TestUtils.Simulate.click(modalHeaderDom.firstChild);


      expectModalToBeClosed(manager);
    });
  });
});
