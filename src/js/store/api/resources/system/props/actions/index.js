import { updateProp, delProp } from './helper';

export function addProp(actions) {
  return (props, prop) => dispatch => {
    dispatch(actions.props.action({
      body: JSON.stringify({
        action: 'set',
        parse_args: prop.value,
      }),
      update: {
        data: updateProp(props, prop),
      },
    }, null, `${prop.domain}/${prop.key}`));
  };
}

export function deleteProp(actions) {
  return (props, prop) => dispatch => {
    const url = prop.key ? `${prop.domain}/${prop.key}` : prop.domain;

    dispatch(actions.props.remove({
      update: {
        data: delProp(props, prop),
      },
    }, null, url));
  };
}
