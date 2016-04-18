import React, { Component, PropTypes } from 'react';

import Modal from 'components/modal';
import Loader from 'components/loader';
import Tabs, { Pane } from 'components/tabs';
import InfoTable from 'components/info_table';
import SourceCode from 'components/source_code';

import actions from 'store/api/actions';

import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

@connect(
  (state, props) => ({ step: state.api.steps.data[props.id] }),
  dispatch => bindActionCreators({
    fetchStep: actions.steps.fetch,
  }, dispatch)
)
export default class StepModal extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    patch: PropTypes.string,
    steptype: PropTypes.string.isRequired,
    step: PropTypes.shape({
      name: PropTypes.string.isRequired,
      version: PropTypes.string.isRequired,
      patch: PropTypes.string,
      steptype: PropTypes.string.isRequired,
      functions: React.PropTypes.arrayOf(
        PropTypes.shape({
          function_instanceid: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          version: PropTypes.string.isRequired,
          patch: PropTypes.string,
          body: PropTypes.string.isRequired,
          offset: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
    }),
    onClose: PropTypes.func.isRequired,
    fetchStep: PropTypes.func.isRequired,
  };

  /**
   * Fetches detailed information about step.
   */
  componentWillMount() {
    this.props.fetchStep(this.props.id);
  }

  /**
   * Fetches detailed information about step if changed.
   *
   * @param {{ id: number }} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      nextProps.fetchStep(nextProps.id);
    }
  }

  /**
   * Returns modal header with step name, version, ID and type.
   *
   * Version can optionally have path.
   *
   * @param {string} name
   * @param {string} version
   * @param {string?} patch
   * @param {string} steptype
   * @return {ReactElement}
   */
  renderHeader({ name, version, patch, steptype }) {
    return (
      <Modal.Header
        titleId="stepTableModalLabel"
        onClose={this.props.onClose}
      >
        {`${name} `}
        <small>
          {`v${version}`}
          {patch && `.${patch}`}
          {` (${this.props.id})`}
        </small>
        {' '}
        <span className="label label-default">
          {steptype}
        </span>
      </Modal.Header>
    );
  }


  /**
   * Returns modal with detailed information about step.
   *
   * Each step function has its own tab. These tabs are followed by a
   * special info tab with all other information about the step.
   *
   * Function tab has a code tab and an info tab.
   *
   * @return {ReactElement}
   */
  renderBody() {
    return (
      <Tabs className="step-info">
        {this.props.step.functions.map(func => (
          <Pane key={func.type} name={_.capitalize(func.type)}>
            <Tabs className="step-info__func" type="pills">
              <Pane name="Code">
                <InfoTable
                  object={{
                    /* eslint-disable quote-props */
                    'function': `${func.name} v${func.version}` +
                      `${func.patch ? `.${func.patch}` : ''}` +
                      ` (${func.function_instanceid})`,
                    /* eslint-enable quote-props */
                    description: func.description,
                    source: func.source,
                  }}
                />
                <SourceCode lineOffset={parseInt(func.offset, 10)}>
                  {func.body}
                </SourceCode>
              </Pane>
              <Pane name="Function Info">
                <InfoTable object={func} omit={['body', 'type']} />
              </Pane>
            </Tabs>
          </Pane>
        )).concat(
          <Pane key="step-info" name="Step Info">
            <InfoTable object={this.props.step} omit={['functions']} />
          </Pane>
        )}
      </Tabs>
    );
  }


  /**
   * Returns loader if step information are not available.
   *
   * @return {ReactElement}
   */
  renderLoader() {
    return (
      <Loader />
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <Modal>
        {this.renderHeader(this.props.step ? this.props.step : this.props)}
        <Modal.Body>
          {this.props.step ? this.renderBody() : this.renderLoader()}
        </Modal.Body>
      </Modal>
    );
  }
}
