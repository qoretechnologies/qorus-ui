// @flow
import { Icon, Tag } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { Component } from 'react';
import createFragment from 'react-addons-create-fragment';
import PanElement from 'react-element-pan';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { COLORS } from '../../constants/ui';
import { groupInstances } from '../../helpers/orders';
import modal from '../../hocomponents/modal';
import { graph } from '../../lib/graph';
import StepDetailTable from '../../views/order/diagram/step_details';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { ReqoreControlGroup, ReqoreH5 } from '@qoretechnologies/reqore';
import { Control as Button, Controls as ButtonGroup } from '../controls';
import Flex from '../Flex';
import Loader from '../loader';
import Pull from '../Pull';
import StepModal from './modal';

/**
 * Typical list of arguments for step-specific functions.
 *
 * These arguments resemble typical array iterators like `forEach` or
 * `map`.
 *
 * @typedef {{
 *   stepId: number,
 *   colIdx: number,
 *   row: Array<number>,
 *   rowIdx: number
 * }} StepArgs
 */

/**
 * Identifier of helper root (start) step.
 */
const ROOT_STEP_ID = 0;

/**
 * Width of one box on a diagram in SVG user units.
 */
const BOX_MIN_WIDTH = 250;

/**
 * Approximate width of one character of box text in SVG user units.
 *
 * It an approximate width of letter "n".
 */
// const BOX_CHARACTER_WIDTH = 10;

/**
 * Ration between width and height.
 */
const BOX_DIMENSION_RATIO = 3 / 1;

/**
 * Margin between boxes.
 *
 * It expected that this margin behaves similarly to margins CSS for
 * HTML. For example, a box at the edge of diagram has a full margin
 * width diagram border and box. But between boxes margin overlap --
 * in terms of SVG, each is shifted a half of margin in each direction
 * compared to a case without margins.
 */
const BOX_MARGIN = 20;

/**
 * Box rounded corner radius.
 */
const BOX_ROUNDED_CORNER = 5;

/**
 * Minimal numbers of columns diagram must have.
 */
const DIAGRAM_MIN_COLUMNS = 1;

/**
 * Diagram with functions and dependencies between them.
 *
 * The diagram is a SVG drawn by rows which are computed from `steps`
 * dependency graph which is a member of workflow object.
 *
 * Every step (function) is clickable and displays modal with details
 * about that function including its source code. The source code must
 * be fetched via API as it is not usually part of the workflow
 * object.
 */

class StepsTab extends Component {
  props: {
    workflow: any;
    order: any;
    onStepClick: Function;
    onSkipSubmit: Function;
    openModal: Function;
    closeModal: Function;
  } = this.props;

  state: {
    tooltip?: string;
    left: number;
    top: number;
    width: number;
    height: number;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    selectedStep: any;
    diagramScale: number;
    panWidth: number;
    useDrag: boolean;
  } = {
    tooltip: null,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    selectedStep: null,
    diagramScale: 1,
    panWidth: 0,
    useDrag: true,
  };

  /**
   * Opens modal with detailed information about clicked step.
   *
   * @param {number} stepId
   */
  onBoxClick = (stepId) => () => {
    this.props.openModal(
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      <StepModal
        id={stepId}
        name={this.getStepName(stepId)}
        version={this.getStepInfo(stepId).version}
        patch={this.getStepInfo(stepId).patch}
        steptype={this.getStepInfo(stepId).steptype}
        onClose={this.props.closeModal}
        workflow={this.props.workflow}
      />
    );
  };

  /**
   * Returns step dependencies.
   *
   * If no step identifier is passed, it returns map of all step
   * dependencies.
   *
   * A special step (root) is placed above original root as received
   * from the API.
   *
   * @param {(string|number)=} stepId
   * @return {Array<number>}
   * @see ROOT_STEP_ID
   */
  getStepDeps(stepId) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'steps' does not exist on type 'Object'.
    const initIds = Object.keys(this.props.workflow.steps).filter(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'steps' does not exist on type 'Object'.
      (id) => this.props.workflow.steps[id].length <= 0
    );

    const initialDeps = initIds.map((initId) => ({ [initId]: [ROOT_STEP_ID] }));

    const deps = Object.assign(
      { [ROOT_STEP_ID]: [] },
      // @ts-ignore ts-migrate(2339) FIXME: Property 'steps' does not exist on type 'Object'.
      this.props.workflow.steps,
      ...initialDeps
    );

    return typeof stepId !== 'undefined' ? deps[stepId] : deps;
  }

  /**
   * Computes rows with step identifiers.
   *
   * Steps are placed in a matrix based on their
   * dependencies. Returned matrix has at least {@link
   * DIAGRAM_MIN_COLUMNS} columns. Each row has nodes from equivalent
   * depth with each node positioned relatively to its parent taken
   * width into account.
   *
   * @return {Array<Array<number>>}
   * @see graph
   * @see getStepDeps
   * @see DIAGRAM_MIN_COLUMNS
   */
  getRows() {
    // @ts-ignore ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    const nodes = graph(this.getStepDeps());

    const cols = Math.max(DIAGRAM_MIN_COLUMNS, nodes.get(ROOT_STEP_ID).width) * 2 - 1;

    const rows = [];
    // noinspection JSAnnotator
    for (const [id, n] of nodes) {
      if (!rows[n.depth]) rows[n.depth] = new Array(cols);

      let refColMin = cols - 1;
      for (const na of n.above) {
        let col = -1;
        for (const r of rows.slice().reverse()) {
          col = (r || []).indexOf(na.id);
          if (col >= 0) break;
        }
        refColMin = Math.min(refColMin, col);
      }

      let refColMax = 0;
      for (const na of n.above) {
        let col = -1;
        for (const r of rows.slice().reverse()) {
          col = (r || []).indexOf(na.id);
          if (col >= 0) break;
        }
        refColMax = Math.max(refColMax, col);
      }

      const refCol = refColMin + (refColMax - refColMin) / 2;
      const col = refCol + n.position * 2;

      rows[n.depth][Math.floor(col)] = id;
    }

    return rows;
  }

  /**
   * Returns rows in a flat array suitable for iteration.
   *
   * @return {Array<StepArgs>}
   * @see getRows
   */
  getFlattenRows() {
    return this.getRows().reduce(
      (flatten, row, rowIdx) =>
        flatten.concat(
          row
            .map((stepId, colIdx) => ({ stepId, colIdx, row, rowIdx }))
            .filter((s) => typeof s.stepId !== 'undefined')
        ),
      []
    );
  }

  /**
   * Returns arguments for step render methods.
   *
   * @param {number} stepId
   * @return {StepArgs}
   * @see getFlattenRows
   */
  getStepArgs(stepId) {
    return this.getFlattenRows().find((s) => s.stepId === stepId) || null;
  }

  /**
   * Returns flatten dependencies between steps.
   *
   * @return {Array<{
   *   start: StepArgs,
   *   end: StepArgs
   * }>}
   * @see getFlattenRows
   * @see getStepDeps
   * @see getStepArgs
   */
  getFlattenDeps() {
    return this.getFlattenRows().reduce(
      (flatten, step) =>
        flatten.concat(
          this.getStepDeps(step.stepId).map((depId) => ({
            start: this.getStepArgs(depId),
            end: step,
          }))
        ),
      []
    );
  }

  /**
   * Returns detailed information about particular step.
   *
   * @param {number} stepId
   * @return {{
   *   name: string,
   *   ind: number?,
   *   version: string,
   *   patch: string?,
   *   steptype: string,
   *   subwfls: {
   *     name: string,
   *     ind: number?,
   *     version: string,
   *     patch: string?,
   *     steptype: string
   *   }
   * }}
   */
  getStepInfo(stepId) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'stepmap' does not exist on type 'Object'... Remove this comment to see the full error message
    const name = this.props.workflow.stepmap[stepId];
    const info =
      // @ts-ignore ts-migrate(2339) FIXME: Property 'stepinfo' does not exist on type 'Object... Remove this comment to see the full error message
      this.props.workflow.stepinfo.find((si) => si.name === name) || null;

    return info && info.ind === 0
      ? Object.assign({}, info, {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'stepinfo' does not exist on type 'Object... Remove this comment to see the full error message
          subwfls: this.props.workflow.stepinfo.filter((si) => si.name === name),
        })
      : info;
  }

  /**
   * Returns name of particular step.
   *
   * If step idendifier is zero, it returns name of the workflow. This
   * is a special case for root (start) step.
   *
   * @param {number} stepId
   * @return {string}
   * @see ROOT_STEP_ID
   */
  getStepName(stepId) {
    return stepId === ROOT_STEP_ID
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        this.props.workflow.name
      : // @ts-ignore ts-migrate(2339) FIXME: Property 'stepmap' does not exist on type 'Object'... Remove this comment to see the full error message
        this.props.workflow.stepmap[stepId];
  }

  /**
   * Returns step identifier suitable as DOM identifier.
   *
   * It is basically a lowercased step name.
   *
   * @param {number} stepId
   * @return {string}
   * @see getStepName
   */
  getStepDomId(stepId) {
    return this.getStepName(stepId).toLowerCase();
  }

  /**
   * Returns full name of particular step with version and patch.
   *
   * Version or patch are retrived from step info where they might not
   * be present.
   *
   * @param {number} stepId
   * @return {string}
   * @see getStepName
   * @see getStepInfo
   */
  getStepFullname = (stepId) => {
    const info = this.getStepInfo(stepId);

    if (info && info.patch) {
      return `${this.getStepName(stepId)} v${info.version}.${info.patch}`;
    }
    if (info) {
      return `${this.getStepName(stepId)} v${info.version}`;
    }

    return this.getStepName(stepId);
  };

  /**
   * Returns list of all step full names.
   *
   * It also includes a name of special root (start) step.
   *
   * @return {Array<string>}
   * @see getStepFullname
   */
  getStepFullnames() {
    return [this.getStepFullname(0)].concat(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'steps' does not exist on type 'Object'.
      Object.keys(this.props.workflow.steps).map(this.getStepFullname)
    );
  }

  /**
   * Returns length of the longest step name.
   *
   * @return {number}
   * @see getStepFullnames
   */
  getMaxTextWidth() {
    return Math.max(...this.getStepFullnames().map((n) => n.length));
  }

  /**
   * Returns width of a box.
   *
   * The box width is determined from the longest step name but cannot
   * be less than {@link BOX_MIN_WIDTH}.
   *
   * @return {number}
   * @see getMaxTextWidth
   * @see BOX_MIN_WIDTH
   * @see BOX_CHARACTER_WIDTH
   */
  getBoxWidth() {
    return BOX_MIN_WIDTH;
  }

  /**
   * Returns height of a box.
   *
   * The box height is determined by a ratio between width and height.
   *
   * @return {number}
   * @see getBoxWidth
   * @see BOX_DIMENSION_RATIO
   */
  getBoxHeight() {
    return this.getBoxWidth() / BOX_DIMENSION_RATIO;
  }

  /**
   * Returns number of columns on the diagram.
   *
   * It cannot be less than {@link DIAGRAM_MIN_COLUMNS}.
   *
   * @return {number}
   * @see DIAGRAM_MIN_COLUMNS
   * @see getRows
   */
  getDiagramColumns() {
    return Math.max(DIAGRAM_MIN_COLUMNS, this.getRows()[0].length);
  }

  /**
   * Returns number of columns on the diagram.
   *
   * @return {number}
   * @see getRows
   */
  getDiagramRows() {
    return this.getRows().length;
  }

  /**
   * Returns width of a diagram in SVG user units.
   *
   * The diagram width is determined from a number columns and a size
   * of each column (one column = one box width + box margin).
   *
   * @return {number}
   * @see getDiagramColumns
   * @see getBoxWidth
   * @see BOX_MARGIN
   */
  getDiagramWidth() {
    return Math.ceil(this.getDiagramColumns() / 3) * (this.getBoxWidth() + BOX_MARGIN);
  }

  /**
   * Returns height of a diagram in SVG user units.
   *
   * The diagram height is determined from a number rows and a size of
   * each row (one row = one box height + box margin).
   *
   * @return {number}
   * @see getDiagramRows
   * @see getBoxHeight
   * @see BOX_MARGIN
   */
  getDiagramHeight() {
    return this.getDiagramRows() * (this.getBoxHeight() + BOX_MARGIN) + BOX_MARGIN;
  }

  /**
   * Returns center of a box on x-axis.
   *
   * Boxes are spread across the whole space of a row to occupy the
   * same amount of space each.
   *
   * @param {number} colIdx
   * @return {number}
   * @see getDiagramWidth
   * @see BOX_MARGIN
   */
  getBoxHorizontalCenter(colIdx) {
    const hSpace = (this.getBoxWidth() + BOX_MARGIN) / 2;

    return colIdx * hSpace;
  }

  /**
   * Returns center of a box on y-axis.
   *
   * Rows are stacked from the top to the bottom.
   *
   * @param {number} rowIdx
   * @return {number}
   * @see getBoxHeight
   * @see BOX_MARGIN
   */
  getBoxVerticalCenter(rowIdx) {
    const vSpace = this.getBoxHeight() + BOX_MARGIN;

    return BOX_MARGIN / 2 + vSpace * rowIdx + vSpace / 2;
  }

  /**
   * Returns top coordinate of a box.
   *
   * @param {number} colIdx
   * @return {number}
   * @see getBoxHorizontalCenter
   * @see getBoxWidth
   */
  getBoxTopCoord(colIdx) {
    const top = this.getBoxHorizontalCenter(colIdx) + 2;

    return top;
  }

  /**
   * Returns left coordinate of a box.
   *
   * @param {number} rowIdx
   * @return {number}
   * @see getBoxVerticalCenter
   * @see getBoxHeight
   */
  getBoxLeftCoord(rowIdx) {
    const left = this.getBoxVerticalCenter(rowIdx) - this.getBoxHeight() / 2;

    return left;
  }

  /**
   * Returns coordinates and dimensions of a start step.
   *
   * Start (root) step is expected to be an ellipse so its center and
   * radiuses are returned.
   *
   * @return {number}
   * @see getBoxWidth
   * @see getBoxHeight
   */
  getStartParams() {
    return {
      cx: this.getBoxWidth() / 2,
      cy: this.getBoxHeight() / 2,
      rx: this.getBoxWidth() / 2,
      ry: this.getBoxHeight() / 2,
    };
  }

  /**
   * Returns coordinates and dimensions of a general step.
   *
   * Step is generally expected to be a rect so its top-right corner
   * coordinates and width and height are retuned. Rect's corners are
   * rounded to corner radiuses are returned too.
   *
   * @return {number}
   * @see getBoxWidth
   * @see getBoxHeight
   * @see BOX_ROUNDED_CORNER
   */
  getDefaultParams() {
    return {
      rx: BOX_ROUNDED_CORNER,
      ry: BOX_ROUNDED_CORNER,
      width: this.getBoxWidth(),
      height: this.getBoxHeight(),
    };
  }

  /**
   * Returns coordinates and mask of a step name.
   *
   * Step name is a text expected to be aligned to its geometrical
   * center so its center is returned. In addition, this text has a
   * mask to ensure nothing overflows the box. The mask has the same
   * shape as a box itself.
   *
   * @param {number} stepId
   * @return {number}
   * @see getBoxHorizontalCenter
   * @see getBoxVerticalCenter
   */
  getTextParams(stepId) {
    return {
      x: this.getBoxWidth() / 2,
      y: this.getBoxHeight() / 2,
      style: {
        mask: `url('#${this.getStepDomId(stepId)}')`,
        pointerEvents: 'none',
      },
    };
  }

  getIconParams(ord) {
    return {
      x: this.getBoxWidth() - 20 - 22 * ord,
      y: 16,
    };
  }

  /**
   * Returns translate spec for transform attribute of a box.
   *
   * @param {number} colIdx
   * @param {number} rowIdx
   * @return {string}
   * @see getBoxTopCoord
   * @see getBoxLeftCoord
   */
  getBoxTransform(colIdx, rowIdx, margin = 0) {
    return (
      'translate(' +
      `${this.getBoxTopCoord(colIdx) + margin} ` +
      `${this.getBoxLeftCoord(rowIdx) + margin}` +
      ')'
    );
  }

  /**
   * Opens modal with detailed information about clicked step.
   *
   * @param {number} stepId
   */
  handleStepClick = (stepId) => () => {
    this.props.onStepClick(stepId);
  };

  handleMoveChange: Function = () => {
    this.setState((state: any) => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'useDrag' does not exist on type 'Object'... Remove this comment to see the full error message
      useDrag: !state.useDrag,
    }));
  };

  handleZoomIn: Function = () => {
    this.setState((state: any) => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'diagramScale' does not exist on type 'Ob... Remove this comment to see the full error message
      diagramScale: state.diagramScale + 0.1,
    }));
  };

  handleZoomOut: Function = () => {
    this.setState((state: any) => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'diagramScale' does not exist on type 'Ob... Remove this comment to see the full error message
      diagramScale: state.diagramScale - 0.1 < 0 ? 0 : state.diagramScale - 0.1,
    }));
  };

  handleZoomReset: Function = () => {
    this.setState(() => ({
      diagramScale: 1,
    }));
  };

  /**
   * Returns mask element for a start (root) step.
   *
   * Mask has an identifier from slugified step name to be referenced
   * by `mask` attribute.
   *
   * @param {number} stepId
   * @param {number} colIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see getStepDomId
   * @see getStartParams
   */
  renderStartMask(stepId) {
    return (
      <mask id={this.getStepDomId(stepId)}>
        <ellipse {...this.getStartParams()} className="diagram__mask" />
      </mask>
    );
  }

  /**
   * Returns group element for a start (root) step.
   *
   * The group element contains an ellipse and a text with step name.
   *
   * @param {number} stepId
   * @param {number} colIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see getStepFullname
   * @see getStartParams
   * @see getTextParams
   */
  renderStartBox(stepId, colIdx, row, rowIdx) {
    const instances =
      // @ts-ignore ts-migrate(2339) FIXME: Property 'StepInstances' does not exist on type 'O... Remove this comment to see the full error message
      this.props.order && this.props.order.StepInstances
        ? // @ts-ignore ts-migrate(2339) FIXME: Property 'StepInstances' does not exist on type 'O... Remove this comment to see the full error message
          groupInstances(this.props.order.StepInstances)
        : {};
    const css = Object.keys(instances).some((i) => instances[i].status === 'ERROR')
      ? 'error'
      : 'normal';

    return (
      <g
        className={`diagram__box status-${css}-diagram`}
        transform={this.getBoxTransform(colIdx, rowIdx)}
      >
        <circle
          transform={`translate(${this.getBoxWidth() / 2 - 22} 22)`}
          cx="22"
          cy="22"
          r="22"
          fill={COLORS.cobalt}
        />
      </g>
    );
  }

  /**
   * Returns mask element for a general step.
   *
   * Mask has an identifier from slugified step name to be referenced
   * by `mask` attribute.
   *
   * @param {number} stepId
   * @return {ReactElement}
   * @see getStepDomId
   * @see getDefaultParams
   */
  renderDefaultMask(stepId) {
    return (
      <mask id={this.getStepDomId(stepId)}>
        <rect {...this.getDefaultParams()} className="diagram__mask" />
      </mask>
    );
  }

  /**
   * Returns group element for a general step.
   *
   * The group element contains a rect and a text with step name. Box
   * can have special styling based on its type which is reflected by
   * setting class name with that type. It is expected that all
   * general steps have info available because it is a source of step
   * type.
   *
   * @param {number} stepId
   * @param {number} colIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see getStepFullname
   * @see getDefaultParams
   * @see getStepInfo
   * @see getTextParams
   */
  renderDefaultBox(stepId, colIdx, row, rowIdx) {
    const onCodeClick = this.onBoxClick(stepId);
    const handleMouseOver = (event) => {
      event.persist();
      event.stopPropagation();

      if (event.target.tagName === 'rect') {
        const { left, top, width, height } = event.target.getBoundingClientRect();
        // @ts-ignore ts-migrate(2339) FIXME: Property 'stepinfo' does not exist on type 'Object... Remove this comment to see the full error message
        const tooltip = this.props.workflow.stepinfo.find((step) => step.stepid === stepId);

        this.setState({
          tooltip: tooltip ? tooltip.desc : null,
          left,
          top,
          width,
          height,
        });
      }
    };

    const handleMouseOut = () => {
      this.setState({
        tooltip: null,
      });
    };

    const stepInfo = this.getStepInfo(stepId);
    const type = stepInfo ? stepInfo.steptype : '';
    const name = this.getStepName(stepId);
    const typeCss = `status-${type.toLowerCase()}-diagram`;
    let statusCss = '';
    let instances;
    let arrayStep = [];

    if (this.props.order) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'StepInstances' does not exist on type 'O... Remove this comment to see the full error message
      instances = this.props.order.StepInstances
        ? // @ts-ignore ts-migrate(2339) FIXME: Property 'StepInstances' does not exist on type 'O... Remove this comment to see the full error message
          groupInstances(this.props.order.StepInstances)
        : {};

      statusCss = instances[name] ? instances[name].status.toLowerCase() : statusCss;

      if (stepInfo.arraytype !== 'NONE' && instances[name]) {
        arrayStep = instances[name].steps;
      }
    }

    statusCss = `status-${statusCss}-diagram`;

    return (
      <svg>
        {stepInfo.arraytype !== 'NONE' && (
          <svg>
            <g
              className={classNames(statusCss, typeCss, {
                diagram__box: true,
              })}
              transform={this.getBoxTransform(colIdx, rowIdx, 4)}
            >
              <rect {...this.getDefaultParams()} />
            </g>
          </svg>
        )}
        <g
          className={classNames(statusCss, typeCss, {
            diagram__box: true,
            clickable: instances && instances[name],
          })}
          transform={this.getBoxTransform(colIdx, rowIdx)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={() => {
            if (this.props.order && instances && instances[name]) {
              this.setState({ selectedStep: name });
            }
          }}
        >
          <rect {...this.getDefaultParams()} />
          <foreignObject x={0} y={0} width={this.getBoxWidth()} height={this.getBoxHeight()}>
            <Flex height="100%" style={{ padding: '5px' }}>
              <div>
                <Pull>
                  <Tag title="Type & Status">
                    {stepInfo.arraytype !== 'NONE' && (
                      <React.Fragment>
                        [{arrayStep.length}] <Icon icon="dot" />
                      </React.Fragment>
                    )}
                    {type} <Icon icon="dot" />{' '}
                    {instances && instances[name] ? instances[name].status : 'NONE'}
                  </Tag>
                </Pull>
                <Pull right>
                  <ButtonGroup>
                    <Button
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ workflow... Remove this comment to see the full error message
                      title={this.props.intl.formatMessage({
                        id: 'button.show-step-code',
                      })}
                      icon="code"
                      onClick={onCodeClick}
                    />
                  </ButtonGroup>
                </Pull>
              </div>
              <Flex
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  clear: 'both',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                {this.getStepFullname(stepId)}
              </Flex>
            </Flex>
          </foreignObject>
        </g>
      </svg>
    );
  }

  /**
   * Returns mask element for either start (root) or general step.
   *
   * A step with identifier equals to zero is considered a start
   * (root) step.
   *
   * @param {number} stepId
   * @return {ReactElement}
   * @see renderStartMask
   * @see renderDefaultMask
   * @see ROOT_STEP_ID
   */
  renderMask(stepId) {
    return stepId === ROOT_STEP_ID ? this.renderStartMask(stepId) : this.renderDefaultMask(stepId);
  }

  /**
   * Returns group element for either start (root) or general step.
   *
   * A step with identifier equals to zero is considered a start
   * (root) step.
   *
   * @param {number} stepId
   * @param {number} colIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see renderStartBox
   * @see renderStartBox
   * @see ROOT_STEP_ID
   */
  renderBox(stepId, colIdx, row, rowIdx) {
    return stepId === ROOT_STEP_ID
      ? this.renderStartBox(stepId, colIdx, row, rowIdx)
      : this.renderDefaultBox(stepId, colIdx, row, rowIdx);
  }

  /**
   * Returns path element linking two step boxes (groups).
   *
   * The path has a joint right above bottom of the two
   * boxes. Obviously, this joint is invisible for vertically aligned
   * boxes. Otherwise, it makes sure the path is perpendicular to x-
   * and y-axis.
   *
   * @param {StepArgs} start
   * @param {StepArgs} end
   * @return {ReactElement}
   * @see getBoxHorizontalCenter
   * @see getBoxVerticalCenter
   * @see getBoxHeight
   * @see BOX_MARGIN
   */
  renderPath(start, end) {
    const startX = this.getBoxHorizontalCenter(start.colIdx) + this.getBoxWidth() / 2 + 2;
    const startY = this.getBoxVerticalCenter(start.rowIdx) + 2;

    const endX = this.getBoxHorizontalCenter(end.colIdx) + this.getBoxWidth() / 2 + 2;
    const endY = this.getBoxVerticalCenter(end.rowIdx) + 2;

    const joint = Math.max(startY, endY) - this.getBoxHeight() / 2 - BOX_MARGIN / 2 + 2;

    return (
      <path
        d={
          `M${startX},${startY} ` +
          `L${startX},${joint} ` +
          `L${endX},${joint} ` +
          `L${endX},${endY}`
        }
        className="diagram__path"
      />
    );
  }

  /**
   * Returns all mask elements.
   *
   * @return {Array<ReactElement>}
   * @see getFlattenRows
   * @see renderMask
   */
  renderMasks() {
    return createFragment(
      this.getFlattenRows().reduce(
        (fs, { stepId }) =>
          Object.assign(fs, {
            [`m-${this.getStepDomId(stepId)}`]: this.renderMask(stepId),
          }),
        {}
      )
    );
  }

  /**
   * Returns all box group elements.
   *
   * @return {Array<ReactElement>}
   * @see getFlattenRows
   * @see renderBox
   */
  renderBoxes() {
    return this.getFlattenRows().map(({ stepId, colIdx, row, rowIdx }) =>
      this.renderBox(stepId, colIdx, row, rowIdx)
    );
  }

  /**
   * Returns all path elements.
   *
   * @return {Array<ReactElement>}
   * @see getFlattenDeps
   * @see renderPath
   */
  renderPaths() {
    return createFragment(
      this.getFlattenDeps().reduce(
        (fs, { start, end }) =>
          Object.assign(fs, {
            [`p-${this.getStepDomId(start.stepId)}+` + `${this.getStepDomId(end.stepId)}`]:
              this.renderPath(start, end),
          }),
        {}
      )
    );
  }

  handlePanRef = (el) => {
    if (el) {
      const { width } = el.getBoundingClientRect();

      this.setState({ panWidth: width });
    }
  };

  renderContent: Function = (diagramScale, diaWidth) => (
    <div
      style={{
        transform: `scale(${diagramScale})`,
        width: diaWidth,
        transformOrigin: 'center top',
        height: this.getDiagramHeight(),
        margin: 'auto',
      }}
    >
      <svg viewBox={`0 0 ${diaWidth} ${this.getDiagramHeight()}`} className="diagram">
        <defs>{this.renderMasks()}</defs>
        {this.renderPaths()}
        {this.renderBoxes()}
      </svg>
    </div>
  );

  render() {
    const { selectedStep, diagramScale, panWidth, useDrag } = this.state;
    const { order, workflow, onSkipSubmit } = this.props;
    // @ts-ignore ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    const nodes = graph(this.getStepDeps());

    const diaWidth = Math.max(1, nodes.get(ROOT_STEP_ID).width) * (this.getBoxWidth() + BOX_MARGIN);

    const half = diaWidth / 2;
    const panHalf = panWidth / 2;
    const startX = half - panHalf;

    return (
      <Flex>
        <ReqoreControlGroup style={{ justifyContent: 'space-between'}}>
          <ReqoreH5>{workflow.normalizedName}</ReqoreH5>
          <ReqoreControlGroup>
              {useDrag && (
                <span style={{ lineHeight: '30px', paddingRight: 5 }} className="text-muted">
                  <FormattedMessage id="button.drag-to-move-around" />
                </span>
              )}
              <Button
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ workflow... Remove this comment to see the full error message
                title={this.props.intl.formatMessage({
                  id: useDrag ? 'button.use-scrollbars' : 'button.use-drag-to-move',
                })}
                icon="hand"
                onClick={this.handleMoveChange}
                btnStyle={useDrag && 'primary'}
                big
              />
              <Button
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ workflow... Remove this comment to see the full error message
                title={this.props.intl.formatMessage({ id: 'button.zoom-in' })}
                icon="zoom-in"
                onClick={this.handleZoomIn}
                big
              />
              <Button
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ workflow... Remove this comment to see the full error message
                title={this.props.intl.formatMessage({ id: 'button.zoom-out' })}
                icon="zoom-out"
                onClick={this.handleZoomOut}
                big
              />
              <Button
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ workflow... Remove this comment to see the full error message
                title={this.props.intl.formatMessage({
                  id: 'button.reset-zoom',
                })}
                icon="zoom-to-fit"
                onClick={this.handleZoomReset}
                big
              />
          </ReqoreControlGroup>
        </ReqoreControlGroup>
        <div
          ref={this.handlePanRef}
          style={{
            display: 'flex',
            flexFlow: 'column',
            flex: '1 1 auto',
          }}
        >
          {panWidth === 0 ? (
            <Loader />
          ) : (
            [
              useDrag ? (
                // @ts-ignore ts-migrate(2604) FIXME: JSX element type 'PanElement' does not have any co... Remove this comment to see the full error message
                <PanElement startX={startX}>
                  {this.renderContent(diagramScale, diaWidth)}
                </PanElement>
              ) : (
                <div style={{ overflow: 'auto' }}>{this.renderContent(diagramScale, diaWidth)}</div>
              ),
              selectedStep && (
                // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                <StepDetailTable
                  step={selectedStep}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'StepInstances' does not exist on type 'O... Remove this comment to see the full error message
                  instances={order.StepInstances}
                  order={order}
                  onSkipSubmit={onSkipSubmit}
                />
              ),
            ]
          )}
        </div>
      </Flex>
    );
  }
}

export default compose(injectIntl, modal(), onlyUpdateForKeys(['workflow', 'order']))(StepsTab);
