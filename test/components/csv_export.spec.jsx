import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import CsvExport from '../../src/js/components/csv_export';


chai.use(spies);

describe('CsvExport from \'components/csv_export\'', () => {
  class ModalController extends React.Component {
    state = {
      modal: null,
    }

    getChildContext() {
      return {
        openModal: this.openModal,
        closeModal: this.closeModal,
      };
    }

    openModal = (modal) => {
      this.setState({ modal });
    }

    closeModal = () => {
      this.setState({ modal: null });
    }

    render() {
      return (
        <div>
          {this.props.children}
          <div className="modal-place">
            {this.state.modal}
          </div>
        </div>
      );
    }
  }
  ModalController.propTypes = {
    children: PropTypes.any,
  };
  ModalController.childContextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  const node = document.getElementById('test-app');

  const collection = [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
  ];

  it('open modal', () => {
    const wrapper = mount(
      <ModalController>
        <CsvExport type="test" {...{ collection }} />
      </ModalController>,
      {
        attachTo: node,
      }
    );

    wrapper.find('Control').simulate('click');

    expect(wrapper.find('.modal')).to.have.length(1);
  });

  it('close modal', () => {
    const wrapper = mount(
      <ModalController>
        <CsvExport type="test" {...{ collection }} />
      </ModalController>,
      {
        attachTo: node,
      }
    );

    wrapper.find('Control').simulate('click');

    wrapper.find('button.close').simulate('click');

    expect(wrapper.find('.modal')).to.have.length(0);
  });
});
