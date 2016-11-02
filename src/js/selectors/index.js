/* @flow */
const querySelector: Function = (key: string): Function => (
  state: Object,
  props: Object
) => (
  props.location.query[key]
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
  resourceSelector,
  propSelector,
};
