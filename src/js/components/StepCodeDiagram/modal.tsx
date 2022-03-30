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
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { bindActionCreators } from 'redux';
import InfoHeader from '../InfoHeader';
import ConfigItemsTable from '../ConfigItemsTable';
import { rebuildConfigHash } from '../../helpers/interfaces';

@connect(
  (state, props) => ({
    step: state.api.steps.data[props.id],
    workflows: state.api.workflows.data,
    stepWithConfig: state.api.workflows.data
      .find(workflow => workflow.id === props.workflow.id)
      .stepinfo.find(step => step.stepid === props.id),
  }),
  dispatch =>
    bindActionCreators(
      {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'steps' does not exist on type '{}'.
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
    workflow: Object,
  } = this.props;

  /**
   * Fetches detailed information about step.
   */
  componentWillMount () {
    this.props.fetchStep(this.props.id);
  }

  /**
   * Fetches detailed information about step if changed.
   *
   * @param {{ id: number }} nextProps
   */
  componentWillReceiveProps (nextProps) {
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
  renderHeader ({ name, version, patch, steptype }) {
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
  renderBody () {
    const { step } = this.props;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'class' does not exist on type 'Object'.
    const { class: classData, code } = step;

    if (code) {
      return (
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        <Tabs className="step-info" active="code" noContainer>
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element[]; name: string; }' is n... Remove this comment to see the full error message
          <Pane name="Code">
            <InfoHeader model={step} />
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            <SourceCode lineOffset={0} language={step.language}>
              {code}
            </SourceCode>
          </Pane>
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
          <Pane name="Step Info">
            <InfoTable object={step} omit={['class', 'functions']} />
          </Pane>
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'config' does not exist on type 'Object'.
          {this.props.step.config && (
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; key: string; name: stri... Remove this comment to see the full error message
            <Pane key="step-info" name="Config" scrollY>
              <ConfigItemsTable
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepWithConfig' does not exist on type '... Remove this comment to see the full error message
                items={rebuildConfigHash(this.props.stepWithConfig)}
                intrf="workflows"
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                intrfId={this.props.workflow.id}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
                stepId={this.props.step.stepid}
              />
            </Pane>
          )}
        </Tabs>
      );
    }

    return classData ? (
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      <Tabs className="step-info" active="code" noContainer>
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element[]; name: string; }' is n... Remove this comment to see the full error message
        <Pane name="Code">
          <InfoHeader model={classData} />
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          <SourceCode
            lineOffset={parseInt(classData.offset, 10)}
            language={classData.language}
          >
            {classData.body}
          </SourceCode>
        </Pane>
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
        <Pane name="Class Info">
          <InfoTable
            object={{
              ..._.omit(classData, 'offset'),
              source: `${classData.source}:${classData.offset}`,
            }}
            omit={['body', 'type', 'language_info']}
          />
        </Pane>
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
        <Pane name="Step Info">
          <InfoTable object={step} omit={['class', 'functions']} />
        </Pane>
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'config' does not exist on type 'Object'.
        {this.props.step.config && (
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; key: string; name: stri... Remove this comment to see the full error message
          <Pane key="step-info" name="Config" scrollY>
            <ConfigItemsTable
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepWithConfig' does not exist on type '... Remove this comment to see the full error message
              items={rebuildConfigHash(this.props.stepWithConfig)}
              intrf="workflows"
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              intrfId={this.props.workflow.id}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'stepid' does not exist on type 'Object'.
              stepId={this.props.step.stepid}
            />
          </Pane>
        )}
      </Tabs>
    ) : (
      <Tabs
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        className="step-info"
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'functions' does not exist on type 'Objec... Remove this comment to see the full error message
        active={this.props.step.functions[0].type}
        noContainer
      >
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'functions' does not exist on type 'Objec... Remove this comment to see the full error message
        {this.props.step.functions.map(func => (
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; key: any; name: any; }'... Remove this comment to see the full error message
          <Pane key={func.type} name={_.capitalize(func.type)}>
            <Tabs
              // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
              className="step-info__func"
              type="pills"
              active="code"
              noContainer
            >
              // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element[]; name: string; }' is n... Remove this comment to see the full error message
              <Pane name="Code">
                <InfoHeader model={func} />
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                <SourceCode lineOffset={parseInt(func.offset, 10)}>
                  {func.body}
                </SourceCode>
              </Pane>
              // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; key: string; name: stri... Remove this comment to see the full error message
        <Pane key="step-info" name="Step Info">
          <InfoTable object={this.props.step} omit={['functions']} />
        </Pane>
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'config' does not exist on type 'Object'.
        {this.props.step.config && (
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; key: string; name: stri... Remove this comment to see the full error message
          <Pane key="step-config" name="Config" scrollY>
            <ConfigItemsTable
              items={{
                ...rebuildConfigHash(this.props.workflow, true),
              }}
              intrf="workflows"
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              intrfId={this.props.workflow.id}
            />
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
  renderLoader () {
    return <Loader />;
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render () {
    return (
      <Modal width="70vw" height={600}>
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Object' is not assignable to par... Remove this comment to see the full error message
        {this.renderHeader(this.props.step ? this.props.step : this.props)}
        <Modal.Body>
          <Box top fill>
            {this.props.step ? this.renderBody() : this.renderLoader()}
          </Box>
        </Modal.Body>
      </Modal>
    );
  }
}
