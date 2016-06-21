const updateProp = (props, prop) => {
  var newProps = props;

  if (props[prop.domain]) {
    newProps[prop.domain][prop.key] = prop.value;
  } else {
    Object.assign(newProps, { [prop.domain]: { [prop.key]: prop.value } });
  }

  return newProps;
};

const deleteProp = (props, prop) => {
  var newProps = props;

  if (!prop.key) {
    delete newProps[prop.domain];
  } else {
    delete newProps[prop.domain][prop.key];
  }

  return newProps;
};

module.exports.updateProp = updateProp;
module.exports.deleteProp = deleteProp;
