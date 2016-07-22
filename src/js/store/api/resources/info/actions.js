/* @flow */

export function loadPublicInfo(actions: any): Function {
  return () => (dispatch: Function) => dispatch(actions.info.fetch());
}
