// @flow
const setTitle: Function = (title: string): void => {
  document.title = title;
};

const getPlatform: Function = (): string => (
  window.navigator.platform
);

const getControlChar: Function = (): string => (
  getPlatform() === 'MacIntel' ? '⌘' : 'CTRL'
);

export {
  setTitle,
  getPlatform,
  getControlChar,
};
