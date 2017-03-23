/* @flow */
const querySelector: Function = (key: string): Function => (
  state: Object,
  props: Object
) => (
  props.location.query[key]
);

const paramSelector: Function = (key: string): Function => (
  state: Object,
  props: Object
) => (
  props.params[key]
);

const resourceSelector: Function = (resource: string): Function => (
  state: Object,
) => (
  state.api[resource]
);

const propSelector: Function = (prop: string): Function => (
  state: Object,
  props: Object
) => (
  props[prop]
);

export {
  querySelector,
  paramSelector,
  resourceSelector,
  propSelector,
};
