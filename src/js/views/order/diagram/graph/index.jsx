import React, { Component, PropTypes } from 'react';
import createFragment from 'react-addons-create-fragment';
import classNames from 'classnames';

import StepModal from '../../../workflows/detail/step_modal';

import { pureRender } from '../../../../components/utils';
import { groupInstances } from '../../../../helpers/orders';
import { graph } from '../../../../lib/graph';

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
const DIAGRAM_MIN_COLUMNS = 3;


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
@pureRender
export default class StepsTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    order: PropTypes.object,
    onStepClick: PropTypes.func,
  };

  static contextTypes = {
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  state: {
    tooltip?: string,
    left: number,
    top: number,
    width: number,
    height: number,
  } = {
    tooltip: null,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  /**
   * Opens modal with detailed information about clicked step.
   *
   * @param {number} stepId
   */
  onBoxClick = (stepId) => () => {
    this._modal = (
      <StepModal
        id={stepId}
        name={this.getStepName(stepId)}
        version={this.getStepInfo(stepId).version}
        patch={this.getStepInfo(stepId).patch}
        steptype={this.getStepInfo(stepId).steptype}
        onClose={this.onModalClose}
      />
    );

    this.context.openModal(this._modal);
  };

  /**
   * Closes modal with detailed step information.
   */
  onModalClose = () => {
    this.context.closeModal(this._modal);
    this._modal = null;
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
    const initId = Object.keys(this.props.workflow.steps).
    find(id => this.props.workflow.steps[id].length <= 0);

    const deps = Object.assign(
      { [ROOT_STEP_ID]: [] },
      this.props.workflow.steps,
      { [initId]: [ROOT_STEP_ID] }
    );

    return typeof stepId !== 'undefined' ?
      deps[stepId] :
      deps;
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
    const nodes = graph(this.getStepDeps());

    const cols = Math.max(
        DIAGRAM_MIN_COLUMNS,
        nodes.get(ROOT_STEP_ID).width
      ) * 2 - 1;

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
      const col = refCol + n.position * n.width * 2;

      rows[n.depth][col] = id;
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
    return this.getRows().reduce((flatten, row, rowIdx) => (
      flatten.concat(
        row.
        map((stepId, colIdx) => ({ stepId, colIdx, row, rowIdx })).
        filter(s => typeof s.stepId !== 'undefined')
      )
    ), []);
  }

  /**
   * Returns arguments for step render methods.
   *
   * @param {number} stepId
   * @return {StepArgs}
   * @see getFlattenRows
   */
  getStepArgs(stepId) {
    return this.getFlattenRows().find(s => s.stepId === stepId) || null;
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
    return this.getFlattenRows().reduce((flatten, step) => (
      flatten.concat(this.getStepDeps(step.stepId).map(depId => ({
        start: this.getStepArgs(depId),
        end: step,
      })))
    ), []);
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
    const name = this.props.workflow.stepmap[stepId];
    const info = this.props.workflow.stepinfo.find(si => si.name === name) ||
      null;

    return (info && info.ind === 0) ?
      Object.assign({}, info, {
        subwfls: this.props.workflow.stepinfo.filter(si => si.name === name),
      }) :
      info;
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
    return (stepId === ROOT_STEP_ID) ?
      this.props.workflow.name :
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
    return Math.max(...(this.getStepFullnames().map(n => n.length)));
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
    return Math.max(
      DIAGRAM_MIN_COLUMNS,
      this.getRows()[0].length
    );
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
    return Math.ceil(this.getDiagramColumns() / 3) * (
        this.getBoxWidth() + BOX_MARGIN
      );
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
    return this.getDiagramRows() * (
        this.getBoxHeight() + BOX_MARGIN
      ) + BOX_MARGIN;
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
    const top = this.getBoxHorizontalCenter(colIdx);

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
      x: (this.getBoxWidth() - 20) - (22 * ord),
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
    return 'translate(' +
      `${this.getBoxTopCoord(colIdx) - margin} ` +
      `${this.getBoxLeftCoord(rowIdx) + margin}` +
      ')';
  }

  /**
   * Opens modal with detailed information about clicked step.
   *
   * @param {number} stepId
   */
  handleStepClick = (stepId) => () => {
    this.props.onStepClick(stepId);
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
        <ellipse
          {...this.getStartParams()}
          className="diagram__mask"
        />
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
    const instances = this.props.order && this.props.order.StepInstances ?
      groupInstances(this.props.order.StepInstances) : {};
    const css = Object.keys(instances).some(i => instances[i].status === 'ERROR')
      ? 'error' : 'normal';

    return (
      <g
        className={`diagram__box status-${css}-diagram`}
        transform={this.getBoxTransform(colIdx, rowIdx)}
      >
        <ellipse {...this.getStartParams()} />
        <text {...this.getTextParams(stepId, colIdx, row, rowIdx)}>
          {this.getStepFullname(stepId)}
        </text>
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
        <rect
          {...this.getDefaultParams()}
          className="diagram__mask"
        />
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
        const tooltip = this.props.workflow.stepinfo.find(step => step.stepid === stepId);

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
    let css = type.toLowerCase();
    let onBoxClick;
    let instances;
    let arrayStep = [];

    if (this.props.order) {
      instances = this.props.order.StepInstances ?
        groupInstances(this.props.order.StepInstances) : {};
      css = instances[name] ?
          instances[name].status.toLowerCase() : 'normal';
      onBoxClick = instances[name] ? this.handleStepClick(name) : undefined;

      if (stepInfo.arraytype !== 'NONE' && instances[name]) {
        arrayStep = instances[name].steps;
      }
    }

    return (
      <svg>
        {stepInfo.arraytype !== 'NONE' && (
          <svg>
            <g
              className={classNames({
                diagram__box: true,
                'status-normal-diagram': true,
              })}
              transform={this.getBoxTransform(colIdx, rowIdx, 8)}
            >
              <rect {...this.getDefaultParams()} />
            </g>
            <g
              className={classNames({
                diagram__box: true,
                'status-normal-diagram': true,
              })}
              transform={this.getBoxTransform(colIdx, rowIdx, 4)}
            >
              <rect {...this.getDefaultParams()} />
            </g>
          </svg>
        )}
        <g
          className={classNames({
            diagram__box: true,
            [`status-${css}-diagram`]: css,
            clickable: instances && instances[name],
          })}
          transform={this.getBoxTransform(colIdx, rowIdx)}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={onBoxClick}
        >
          <rect {...this.getDefaultParams()} />
          <text {...this.getTextParams(stepId, colIdx, row, rowIdx)}>
            {this.getStepFullname(stepId)}
          </text>
          {stepInfo.arraytype !== 'NONE' && (
            <text
              x={15}
              y={13}
            >
              [{arrayStep.length}]
            </text>
          )}
          <text
            x={225}
            y={13}
            className="link"
            onClick={onCodeClick}
          >
            CODE
          </text>
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
    return (stepId === ROOT_STEP_ID) ?
      this.renderStartMask(stepId) :
      this.renderDefaultMask(stepId);
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
    return (stepId === ROOT_STEP_ID) ?
      this.renderStartBox(stepId, colIdx, row, rowIdx) :
      this.renderDefaultBox(stepId, colIdx, row, rowIdx);
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
    const startX = this.getBoxHorizontalCenter(start.colIdx) + (this.getBoxWidth() / 2);
    const startY = this.getBoxVerticalCenter(start.rowIdx);

    const endX = this.getBoxHorizontalCenter(end.colIdx) + (this.getBoxWidth() / 2);
    const endY = this.getBoxVerticalCenter(end.rowIdx);

    const joint =
      Math.max(startY, endY) -
      this.getBoxHeight() / 2 -
      BOX_MARGIN / 2;

    return (
      <path
        d={`M${startX},${startY} ` +
           `L${startX},${joint} ` +
           `L${endX},${joint} ` +
           `L${endX},${endY}`}
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
      this.getFlattenRows().reduce((fs, { stepId }) => (
        Object.assign(fs, {
          [`m-${this.getStepDomId(stepId)}`]:
            this.renderMask(stepId),
        })
      ), {})
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
    return createFragment(
      this.getFlattenRows().reduce((fs, { stepId, colIdx, row, rowIdx }) => (
        Object.assign(fs, {
          [`b-${this.getStepDomId(stepId)}`]:
            this.renderBox(stepId, colIdx, row, rowIdx),
        })
      ), {})
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
      this.getFlattenDeps().reduce((fs, { start, end }) => (
        Object.assign(fs, {
          [`p-${this.getStepDomId(start.stepId)}+` +
          `${this.getStepDomId(end.stepId)}`]: this.renderPath(start, end),
        })
      ), {})
    );
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const { tooltip, left, top, width, height } = this.state;
    const nodes = graph(this.getStepDeps());

    const diaWidth = Math.max(3, nodes.get(ROOT_STEP_ID).width) * (this.getBoxWidth() + BOX_MARGIN);

    return (
      <div
        ref={this.wrapperRef}
        className="diagram-inner"
        style={{
          width: diaWidth,
        }}
      >
        { tooltip && (
          <div
            className="svg-tooltip"
            style={{
              width,
              left,
              top: top + height + 10,
            }}
          >
            <div className="svg-tooltip-arrow" />
            <p><span> Description: </span> { tooltip }</p>
          </div>
        )}
        <svg
          viewBox={`0 0 ${diaWidth} ${this.getDiagramHeight()}`}
          className="diagram"
        >
          <defs>
            {this.renderMasks()}
          </defs>
          {this.renderPaths()}
          {this.renderBoxes()}
        </svg>
      </div>
    );
  }
}
