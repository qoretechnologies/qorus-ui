import React, { Component } from 'react';

import Modal from '../modal';
import Loader from '../loader';
import Tabs, { Pane } from '../tabs';
import InfoTable from '../info_table';
import SourceCode from '../source_code';
import Box from '../box';

import actions from '../../store/api/actions';

import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InfoHeader from '../InfoHeader';
import ConfigItemsTable from '../ConfigItemsTable';
import { rebuildConfigHash } from '../../helpers/interfaces';

@connect(
  (state, props) => ({ step: state.api.steps.data[props.id] }),
  dispatch =>
    bindActionCreators(
      {
        fetchStep: actions.steps.fetch,
      },
      dispatch
    )
)
export default class StepModal extends Component {
  props: {
    id: number,
    name: string,
    version: string,
    patch?: string,
    steptype: string,
    step: Object,
    onClose: Function,
    fetchStep: Function,
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
      <Modal.Header titleId="stepTableModalLabel" onClose={this.props.onClose}>
        {`${name} `}
        <small>
          {`v${version}`}
          {patch && `.${patch}`}
          {` (${this.props.id})`}
        </small>{' '}
        <span className="label label-default">{steptype}</span>
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
    const { step } = this.props;
    const { class: classData } = step;

    return (
      <Box top fill>
        {classData ? (
          <Tabs className="step-info" active="code" noContainer>
            <Pane name="Code">
              <InfoHeader model={classData} />
              <SourceCode
                lineOffset={parseInt(classData.offset, 10)}
                language={classData.language}
              >
                {classData.body}
              </SourceCode>
            </Pane>
            <Pane name="Class Info">
              <InfoTable
                object={{
                  ..._.omit(classData, 'offset'),
                  source: `${classData.source}:${classData.offset}`,
                }}
                omit={['body', 'type', 'language_info']}
              />
            </Pane>
            <Pane name="Step Info">
              <InfoTable object={step} omit={['class', 'functions']} />
            </Pane>
            {this.props.step.config && (
              <Pane key="step-info" name="Config">
                <ConfigItemsTable
                  items={rebuildConfigHash(this.props.step)}
                  intrf="workflows"
                />
              </Pane>
            )}
          </Tabs>
        ) : (
          <Tabs
            className="step-info"
            active={this.props.step.functions[0].type}
            noContainer
          >
            {this.props.step.functions.map(func => (
              <Pane key={func.type} name={_.capitalize(func.type)}>
                <Tabs
                  className="step-info__func"
                  type="pills"
                  active="code"
                  noContainer
                >
                  <Pane name="Code">
                    <InfoHeader model={func} />
                    <SourceCode lineOffset={parseInt(func.offset, 10)}>
                      {func.body}
                    </SourceCode>
                  </Pane>
                  <Pane name="Function Info">
                    <InfoTable
                      object={{
                        ..._.omit(func, 'offset'),
                        source: `${func.source}:${func.offset}`,
                      }}
                      omit={['body', 'type']}
                    />
                  </Pane>
                </Tabs>
              </Pane>
            ))}
            <Pane key="step-info" name="Step Info">
              <InfoTable object={this.props.step} omit={['functions']} />
            </Pane>
            {this.props.step.config && (
              <Pane key="step-info" name="Config">
                <ConfigItemsTable
                  items={rebuildConfigHash(this.props.step)}
                  intrf="workflows"
                />
              </Pane>
            )}
          </Tabs>
        )}
      </Box>
    );
  }

  /**
   * Returns loader if step information are not available.
   *
   * @return {ReactElement}
   */
  renderLoader() {
    return <Loader />;
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <Modal width="70vw">
        {this.renderHeader(this.props.step ? this.props.step : this.props)}
        <Modal.Body>
          {this.props.step ? this.renderBody() : this.renderLoader()}
        </Modal.Body>
      </Modal>
    );
  }
}
