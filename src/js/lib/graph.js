/**
 * @typedef {{
 *   id: number,
 *   above: Array<!GraphNode>,
 *   below: Array<!GraphNode>,
 *   depth: number,
 *   weight: number,
 *   width: number
 * }} GraphNode
 */


/**
 * Yields all nodes downwards starting with given node itself.
 *
 * @param {!GraphNode} node
 * @return {Generator<!GraphNode>}
 */
export function* descendants(node) {
  yield node;

  for (const below of node.below) yield* descendants(below);
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
  };
}


/**
 * Yields nodes on the way towards the root with given node itself.
 *
 * It uses the first node above so this does not have to be the
 * shortest path.
 *
 * @param {!GraphNode} node
 * @return {Generator<!GraphNode>}
 */
function* upwardPath(node) {
  yield node;

  if (node.above[0]) yield* upwardPath(node.above[0]);
}


/**
 * Adds new node below.
 *
 * It also sets depth, width and weight according to their simple
 * sementics without trying to balance the tree.
 *
 * It sets the following features:
 *
 * - node `below`'s depth is set under the deepest of its nodes above,
 * - `node`'s weight is increased is it the first node above for given
 *    node `below`,
 * - width is left at initial value to be set during balancing.
 *
 * @param {!GraphNode} node
 * @param {!GraphNode} above
 */
function add(node, below) {
  node.below.push(below);

  if (below.depth <= node.depth) {
    Object.assign(below, { depth: node.depth + 1 });
  }

  const isFirstAbove = below.above.push(node) === 1;
  if (!isFirstAbove) return;

  for (const n of upwardPath(node)) n.weight += 1;
}


/**
 * Yields all nodes upwards starting with given node itself.
 *
 * @param {!GraphNode} node
 * @return {Generator<!GraphNode>}
 */
function* ascendants(node) {
  yield node;

  for (const above of node.above) yield* ascendants(above);
}


/**
 * Compares to nodes by their weight.
 *
 * It returns value less than zero if weight of `a` is leas then
 * `b`. It returns value greater than zero if weight of `a` is greater
 * then `b`. If weights of `a` and `b` are equal, it returns zero.
 *
 * @param {!GraphNode} a
 * @param {!GraphNode} b
 * @return {number}
 */
function compare(a, b) {
  if (a.weight < b.weight) return -1;
  if (a.weight > b.weight) return +1;

  return 0;
}


/**
 * Makes sure graph is balanced.
 *
 * Balanced graph has following properties:
 *
 * - each depth level has nodes with the same width,
 * - node's width is a sum of widths of nodes below,
 * - nodes below are ordered in a way that more weight a node has more
 *   towards center it is placed.
 *
 * @param {!GraphNode}
 */
function balance(node) {
  const levels = [];
  for (const n of descendants(node)) {
    if (!levels[n.depth]) {
      levels[n.depth] = [];
    }
    levels[n.depth].push(n);
  }

  for (const l of levels.reverse()) {
    const maxWidth = Math.max(...l.map(n => n.width));
    for (const n of l) {
      for (const asc of ascendants(n)) {
        const ascWidth = Math.max(
          maxWidth,
          asc.below.reduce((w, nb) => w + nb.width, 0)
        );
        if (asc.width < ascWidth) asc.width = ascWidth;
      }
    }
  }

  for (const n of descendants(node)) {
    const sorted = n.below.sort(compare);
    const centerIdx = Math.floor(sorted.length / 2);
    const left = sorted.slice(0, centerIdx);
    const right = sorted.slice(centerIdx).reverse();

    n.below = left.concat(right);
  }
}


/**
 * Returns root node of balanced directional graph.
 *
 * Graph is organized with a root on the top. Each node can have many
 * node above and below. The root node has no node above.
 *
 * Dependency map assigns to particular node nodes which are above
 * it. Nodes are referenced as number identifiers.
 *
 * It is expected given dependency map does not contain any cycles but
 * no attempt to detect them is made.
 *
 * The implementation also relies on the fact that Object properties
 * with string names are in fact ordered. This is a safe bet against
 * ECMAScript spec because many popular library and frameworks work
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
