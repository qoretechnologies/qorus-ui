/* @flow */
const querySelector: Function = (
  key: string
): Function => (
  state: Object,
  props: Object
) => (
  props.location.query[key]
);

export {
  querySelector,
};
