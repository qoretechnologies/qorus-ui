import React, { Component, PropTypes } from 'react';


import createFragment from 'react-addons-create-fragment';
import { pureRender } from 'components/utils';


/**
 * Typical list of arguments for step-specific functions.
 *
 * These arguments resemble typical array iterators like `forEach` or
 * `map`.
 *
 * @typedef {{
 *   stepId: number,
 *   stepIdx: number,
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
 * It is slighly less than a width of letter "a".
 */
const BOX_CHARACTER_WIDTH = 8;


/**
 * Ration between width and height.
 */
const BOX_DIMENSION_RATIO = 4 / 1;


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
  };


  /**
   * Returns dependencies of particular step.
   *
   * It handles special case of a step with no dependecies. Such step
   * has a start (root) step as dependency.
   *
   * If no dependencies are found in workflow object, an empty array
   * is returned. This typically happens for start (root) step.
   *
   * @param {string|number} stepId
   * @return {Array<number>}
   * @see ROOT_STEP_ID
   */
  getStepDeps(stepId) {
    if (!this.props.workflow.steps[stepId]) {
      return [];
    } else if (this.props.workflow.steps[stepId].length <= 0) {
      return [ROOT_STEP_ID];
    }

    return this.props.workflow.steps[stepId];
  }


  /**
   * Computes rows with step identifiers.
   *
   * Steps are placed to rows based on their dependencies. A special
   * step (root) is placed to the first row because it has no
   * dependencies. Other steps are placed in a way that they are
   * always below all their dependencies. Every row is also sorted by
   * step identifier.
   *
   * @return {Array<Array<number>>}
   * @see getDependencies
   * @see ROOT_STEP_ID
   */
  getRows() {
    const rows = [];

    rows.push([ROOT_STEP_ID]);

    Object.keys(this.props.workflow.steps).forEach(stepId => {
      const rowIdx = this.getStepDeps(stepId).reduce((maxIdx, depId) => (
        Math.max(
          maxIdx,
          rows.findIndex(row => row.some(id => id === depId))
        )
      ), 0) + 1;

      if (!rows[rowIdx]) rows[rowIdx] = [];

      rows[rowIdx] = rows[rowIdx].concat(parseInt(stepId, 10)).sort();
    });

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
      flatten.concat(row.map((stepId, stepIdx) => ({
        stepId,
        stepIdx,
        row,
        rowIdx,
      })))
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
   *   a: StepArgs,
   *   b: StepArgs
   * }>}
   * @see getFlattenRows
   * @see getStepDeps
   * @see getStepArgs
   */
  getFlattenDeps() {
    return this.getFlattenRows().reduce((flatten, step) => (
      flatten.concat(this.getStepDeps(step.stepId).map(depId => ({
        a: step,
        b: this.getStepArgs(depId),
      })))
    ), []);
  }


  /**
   * Returns number of rows found in the workflow.
   *
   * @return {number}
   */
  getNumberOfRows() {
    return this.getRows().length;
  }


  /**
   * Returns number of columns found in the workflow.
   *
   * @return {number}
   */
  getNumberOfColumns() {
    return Math.max(...this.getRows().map(r => r.length));
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
   *   subwfls: {
   *     name: string,
   *     ind: number?,
   *     version: string,
   *     patch: string?
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
  getStepFullname(stepId) {
    const info = this.getStepInfo(stepId);

    if (info && info.patch) {
      return `${this.getStepName(stepId)} v${info.version}.${info.patch}`;
    } else if (info) {
      return `${this.getStepName(stepId)} v${info.version}`;
    }

    return this.getStepName(stepId);
  }


  /**
   * Returns list of all step full names.
   *
   * It also includes a name of special root (start) step.
   *
   * @return {Array<string>}
   * @see getStepFullname
   */
  getStepFullnames() {
    return Object.keys(this.props.workflow.steps).
      map(id => this.getStepFullname(id)).
      splice(0, 0, this.getStepFullname(0));
  }


  /**
   * Returns length of the longest step name.
   *
   * @return {number}
   * @see getStepFullnames
   */
  getMaxTextWidth() {
    return Math.max(...this.getStepFullnames().map(n => n.length));
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
    return Math.max(
      BOX_MIN_WIDTH,
      this.getMaxTextWidth() * BOX_CHARACTER_WIDTH
    );
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
   * @see getNumberOfColumns
   * @see DIAGRAM_MIN_COLUMNS
   */
  getDiagramColumns() {
    return Math.max(
      DIAGRAM_MIN_COLUMNS,
      this.getNumberOfColumns()
    );
  }


  /**
   * Returns number of columns on the diagram.
   *
   * @return {number}
   * @see getNumberOfRows
   */
  getDiagramRows() {
    return this.getNumberOfRows();
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
    return this.getDiagramColumns() * (
      this.getBoxWidth() + BOX_MARGIN
    ) + BOX_MARGIN;
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
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @return {number}
   * @see getDiagramWidth
   * @see BOX_MARGIN
   */
  getBoxHorizontalCenter(stepIdx, row) {
    const hSpace = this.getDiagramWidth() / row.length;

    return BOX_MARGIN / 2 + hSpace * stepIdx + hSpace / 2;
  }


  /**
   * Returns center of a box on y-axis.
   *
   * Rows are stacked from the top to the bottom.
   *
   * @param {number} stepId
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {number}
   * @see getBoxHeight
   * @see BOX_MARGIN
   */
  getBoxVerticalCenter(rowIdx) {
    const vSpace = this.getBoxHeight() + BOX_MARGIN;

    return BOX_MARGIN / 2 + vSpace * rowIdx + vSpace / 2;
  }


  getBoxTopCoord(stepIdx, row) {
    return this.getBoxHorizontalCenter(stepIdx, row) - this.getBoxWidth() / 2;
  }


  getBoxLeftCoord(rowIdx) {
    return this.getBoxVerticalCenter(rowIdx) - this.getBoxHeight() / 2;
  }


  /**
   * Returns coordinates and dimensions of a start step.
   *
   * Start (root) step is expected to be an ellipse so its center and
   * radiuses are returned.
   *
   * @param {number} stepId
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {number}
   * @see getBoxHorizontalCenter
   * @see getBoxVerticalCenter
   * @see getBoxWidth
   * @see getBoxHeight
   */
  getStartParams(stepId, stepIdx, row, rowIdx) {
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
   * @param {number} stepId
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {number}
   * @see getBoxHorizontalCenter
   * @see getBoxVerticalCenter
   * @see getBoxWidth
   * @see getBoxHeight
   * @see BOX_ROUNDED_CORNER
   */
  getDefaultParams(stepId, stepIdx, row, rowIdx) {
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
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {number}
   * @see getBoxHorizontalCenter
   * @see getBoxVerticalCenter
   */
  getTextParams(stepId, stepIdx, row, rowIdx) {
    return {
      x: this.getBoxWidth() / 2,
      y: this.getBoxHeight() / 2,
      style: {
        mask: `url('#${this.getStepDomId(stepId)}')`,
      },
    };
  }


  getBoxTransform(stepIdx, row, rowIdx) {
    return 'translate(' +
      `${this.getBoxTopCoord(stepIdx, row)} ` +
      `${this.getBoxLeftCoord(rowIdx)}` +
    ')';
  }


  onBoxClick() {
  }


  /**
   * Returns mask element for a start (root) step.
   *
   * Mask has an identifier from slugified step name to be referenced
   * by `mask` attribute.
   *
   * @param {number} stepId
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see getStepDomId
   * @see getStartParams
   */
  renderStartMask(stepId, stepIdx, row, rowIdx) {
    return (
      <mask id={this.getStepDomId(stepId)}>
        <ellipse
          {...this.getStartParams(stepId, stepIdx, row, rowIdx)}
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
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see getStepFullname
   * @see getStartParams
   * @see getTextParams
   */
  renderStartBox(stepId, stepIdx, row, rowIdx) {
    return (
      <g
        className="diagram__box diagram__box--start"
        transform={this.getBoxTransform(stepIdx, row, rowIdx)}
      >
        <ellipse {...this.getStartParams(stepId, stepIdx, row, rowIdx)} />
        <text {...this.getTextParams(stepId, stepIdx, row, rowIdx)}>
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
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see getStepDomId
   * @see getDefaultParams
   */
  renderDefaultMask(stepId, stepIdx, row, rowIdx) {
    return (
      <mask id={this.getStepDomId(stepId)}>
        <rect
          {...this.getDefaultParams(stepId, stepIdx, row, rowIdx)}
          className="diagram__mask"
        />
      </mask>
    );
  }


  /**
   * Returns group element for a general step.
   *
   * The group element contains a rect and a text with step name.
   *
   * @param {number} stepId
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see getStepFullname
   * @see getDefaultParams
   * @see getTextParams
   */
  renderDefaultBox(stepId, stepIdx, row, rowIdx) {
    return (
      <g
        className="diagram__box"
        transform={this.getBoxTransform(stepIdx, row, rowIdx)}
      >
        <rect {...this.getDefaultParams(stepId, stepIdx, row, rowIdx)} />
        <text {...this.getTextParams(stepId, stepIdx, row, rowIdx)}>
          {this.getStepFullname(stepId)}
        </text>
      </g>
    );
  }


  /**
   * Returns mask element for either start (root) or general step.
   *
   * A step with identifier equals to zero is considered a start
   * (root) step.
   *
   * @param {number} stepId
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see renderStartMask
   * @see renderDefaultMask
   * @see ROOT_STEP_ID
   */
  renderMask(stepId, stepIdx, row, rowIdx) {
    return (stepId === ROOT_STEP_ID) ?
      this.renderStartMask(stepId, stepIdx, row, rowIdx) :
      this.renderDefaultMask(stepId, stepIdx, row, rowIdx);
  }


  /**
   * Returns group element for either start (root) or general step.
   *
   * A step with identifier equals to zero is considered a start
   * (root) step.
   *
   * @param {number} stepId
   * @param {number} stepIdx
   * @param {Array<number>} row
   * @param {number} rowIdx
   * @return {ReactElement}
   * @see renderStartBox
   * @see renderStartBox
   * @see ROOT_STEP_ID
   */
  renderBox(stepId, stepIdx, row, rowIdx) {
    return (stepId === ROOT_STEP_ID) ?
      this.renderStartBox(stepId, stepIdx, row, rowIdx) :
      this.renderDefaultBox(stepId, stepIdx, row, rowIdx);
  }


  /**
   * Returns path element linking two step boxes (groups).
   *
   * The path has a joint right in the middle. Obviously, this joint
   * is invisible for vertically aligned boxes. Otherwise, it makes
   * sure the path is perpendicular to x- and y-axis.
   *
   * @param {StepArgs} a
   * @param {StepArgs} b
   * @return {ReactElement}
   * @see getBoxHorizontalCenter
   * @see getBoxVerticalCenter
   */
  renderPath(a, b) {
    const startX = this.getBoxHorizontalCenter(a.stepIdx, a.row);
    const startY = this.getBoxVerticalCenter(a.rowIdx);

    const endX = this.getBoxHorizontalCenter(b.stepIdx, b.row);
    const endY = this.getBoxVerticalCenter(b.rowIdx);

    const jointY = Math.min(startY, endY) + (
      Math.max(endY, startY) - Math.min(startY, endY)
    ) / 2;

    return (
      <path
        d={`M${startX},${startY} ` +
           `L${startX},${jointY} ` +
           `L${endX},${jointY} ` +
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
      this.getFlattenRows().reduce((fs, { stepId, stepIdx, row, rowIdx }) => (
        Object.assign(fs, {
          [`m-${this.getStepDomId(stepId)}`]:
            this.renderMask(stepId, stepIdx, row, rowIdx),
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
      this.getFlattenRows().reduce((fs, { stepId, stepIdx, row, rowIdx }) => (
        Object.assign(fs, {
          [`b-${this.getStepDomId(stepId)}`]:
            this.renderBox(stepId, stepIdx, row, rowIdx),
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
      this.getFlattenDeps().reduce((fs, { a, b }) => (
        Object.assign(fs, {
          [`p-${this.getStepDomId(a.stepId)}+` +
           `${this.getStepDomId(b.stepId)}`]: this.renderPath(a, b),
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
    return (
      <svg
        viewBox={`0 0 ${this.getDiagramWidth()} ${this.getDiagramHeight()}`}
        className="diagram"
      >
        <defs>
          {this.renderMasks()}
        </defs>
        {this.renderPaths()}
        {this.renderBoxes()}
      </svg>
    );
  }
}
