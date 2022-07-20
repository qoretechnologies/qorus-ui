// @flow

const transformSuccess: Function = (value: string): string => {
  let success;

  switch (value) {
    case 'Yes':
      success = '1';
      break;
    case 'No':
      success = '0';
      break;
    case 'All':
      success = '';
      break;
    case '1':
      success = 'Yes';
      break;
    case '0':
      success = 'No';
      break;
    default:
      success = 'All';
      break;
  }

  return success;
};


export {
  transformSuccess,
};
