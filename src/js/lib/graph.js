/**
 * @typedef {{
 *   id: number,
 *   above: Array<!GraphNode>,
 *   below: Array<!GraphNode>,
 *   depth: number,
 *   weight: number,
 *   width: number,
 *   position: number
 * }} GraphNode
 */


/**
 * Main node above is a refence for position of nodes below.
 */
export const ABOVE_MAIN_IDX = 0;


/**
 * Yields all nodes downwards starting with given node itself.
 *
 * @param {!GraphNode} node
 * @return {Generator<!GraphNode>}
 */
export function* descendants(node) {
  yield node;

  for (const below of node.below) {
    if (below.above[ABOVE_MAIN_IDX] !== node) continue;

    yield* descendants(below);
  }
}


/**
 * Yields all nodes upwards.
 *
 * Unline {@link descendants}, it does not yield given node.
 *
 * @param {!GraphNode} node
 * @return {Generator<!GraphNode>}
 */
function* ascendants(node) {
  for (const above of node.above) {
    yield above;
    yield* ascendants(above);
  }
}


/**
 * Initializes node structure.
 *
 * @param {number} id
 * @return {!GraphNode}
 */
function create(id) {
  return {
    id,
    above: [],
    below: [],
    depth: 0,
    weight: 1,
    width: 1,
    position: 0,
  };
}


/**
 * Adds new node below.
 *
 * It also sets below node's depth right under its deepest node
 * above. Other features are computed during {@link balance} phase.
 *
 * @param {!GraphNode} node
 * @param {!GraphNode} below
 */
function add(node, below) {
  node.below.push(below);

  if (below.depth <= node.depth) {
    Object.assign(below, { depth: node.depth + 1 });
  }

  below.above.push(node);
}


/**
 * Direction for node comparator.
 *
 * @enum {number}
 */
const Dir = {
  ASC: +1,
  DESC: -1,
};


/**
 * Returns node comparator.
 *
 * Nodes are compared based on product of their depth and weight.
 *
 * @param {Dir} dir
 * @return {function(!GraphNode, !GraphNode): number}
 */
function createComparator(dir) {
  return function compare(a, b) {
    return dir * (a.depth * a.weight - b.depth * b.weight);
  };
}


/**
 * Returns nodes divided according to their depth.
 *
 * @param {!GraphNode} node
 * @return {Array<!GraphNode>}
 */
function nodesByDepth(node) {
  const levels = [];
  for (const n of descendants(node)) {
    if (!levels[n.depth]) levels[n.depth] = [];

    levels[n.depth].push(n);
  }

  return levels;
}


/**
 * Sets balanced width on all nodes in the graph.
 *
 * @param {!GraphNode} node
 * @see balance
 */
function setBalancedWidth(node) {
  for (const l of nodesByDepth(node).reverse()) {
    const maxWidth = Math.max(...l.map(n => n.width));
    for (const n of l) {
      n.width = maxWidth;

      for (const asc of ascendants(n)) {
        const ascWidth = Math.max(
          maxWidth,
          asc.below.reduce((w, nb) => w + nb.width, 0)
        );
        if (asc.width < ascWidth) asc.width = ascWidth;
      }
    }
  }
}


/**
 * Sets balanced weight on all nodes in the graph.
 *
 * It also sorts all nodes above so that the heaviest and deepest node
 * is the first one.
 *
 * @param {!GraphNode} node
 * @see balance
 */
function setBalancedWeight(node) {
  for (const l of nodesByDepth(node).reverse()) {
    for (const n of l) {
      for (const na of n.above) {
        na.weight += n.weight / n.above.length;
      }
    }
  }

  for (const l of nodesByDepth(node).reverse()) {
    for (const n of l) {
      n.above.sort(createComparator(Dir.DESC));
    }
  }
}


function isMainAbove(node, below) {
  return below.above[ABOVE_MAIN_IDX] === node;
}


/**
 * Sets balanced position on all nodes in the graph.
 *
 * @param {!GraphNode} node
 * @see balance
 */
function setBalancedPosition(node) {
  const setPos = (start, n, idx) => Object.assign(n, { position: start + idx });

  for (const n of descendants(node)) {
    n.below.sort(createComparator(Dir.ASC));

    const centerIdx = Math.floor(n.below.length / 2);

    const left = n.below.slice(0, centerIdx);
    const right = n.below.slice(centerIdx).reverse();

    n.below = left.concat(right);

    const startPos = -1 * left.length;
    n.below.
      filter(isMainAbove.bind(null, n)).
      forEach(setPos.bind(null, startPos));
  }
}


/**
 * Makes sure graph is balanced.
 *
 * Balanced graph has following properties:
 *
 * - each depth level has nodes with the same width,
 * - node's width is a sum of widths of nodes below,
 * - node's weight is a sum of weights of all nodes below dividens by
 *   below node's number of nodes above,
 * - the main node above is the heaviest and deepest node and it can
 *   be referenced as the first node above,
 * - nodes below are ordered in a way that more weight and depth a
 *   node has more towards the center it is placed,
 * - position on nodes below whose current node is their main one
 *   above is set relative that main node above (negative on the left,
 *   positive on the right),
 * - position of the heaviest and deepest node is always zero, even if
 *   there is even number of its siblings.
 *
 * @param {!GraphNode} node
 * @see createComparator
 * @see setBalancedWidth
 * @see setBalancedWeight
 * @see setBalancedPosition
 */
function balance(node) {
  setBalancedWidth(node);
  setBalancedWeight(node);
  setBalancedPosition(node);
}


/**
 * Returns root node of balanced directional graph.
 *
 * Graph is organized with a root on the top. Each node can have many
 * node above and below. The root node has no node above.
 *
 * Dependency map assigns nodes to particular node. These nodes are
 * above that particular node. Nodes are referenced as number
 * identifiers.
 *
 * It is expected that given dependency map does not contain any
 * cycles but no attempt to detect them is made.
 *
 * The implementation also relies on the fact that Object properties
 * with string names are ordered. This is a safe bet against
 * ECMAScript spec because many popular libraries and frameworks work
 * with this assumption which is true from all key
 * ECMAScript/JavaScript implementations.
 *
 * @param {Object<number, Array<number>>} deps
 * @return {!GraphNode}
 */
export function graph(deps) {
  const nodes = Object.keys(deps).reduce((n, id) => (
    Object.assign(n, { [id]: create(parseInt(id, 10)) })
  ), {});

  Object.keys(deps).forEach(id => (
    deps[id].forEach(depId => add(nodes[depId], nodes[id]))
  ));

  const rootId = Object.keys(deps).find(id => deps[id].length === 0);
  balance(nodes[rootId]);

  return nodes[rootId];
}
