const updateProps = (props, prop) => {
  const newProps = props;

  if (props[prop.domain]) {
    newProps[prop.domain][prop.key] = prop.value;
  } else {
    Object.assign(newProps, { [prop.domain]: { [prop.key]: prop.value } });
  }

  return newProps;
};

const deleteProps = (props, prop) => {
  const newProps = props;

  if (!prop.key) {
    delete newProps[prop.domain];
  } else {
    delete newProps[prop.domain][prop.key];
  }

  return newProps;
};

export {
  updateProps,
  deleteProps,
};
