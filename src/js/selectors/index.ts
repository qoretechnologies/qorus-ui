/* @flow */
const querySelector: Function = (key: string): Function => (
  state: Object,
  props: Object
) => (
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Object... Remove this comment to see the full error message
  props.location.query[key]
);

const paramSelector: Function = (key: string): Function => (
  state: Object,
  props: Object
) => (
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  props.params[key]
);

const resourceSelector: Function = (resource: string): Function => (
  state: Object,
) => (
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
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
