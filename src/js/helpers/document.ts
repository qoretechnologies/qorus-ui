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

const getCookie: Function = (cname: string) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return null;
};

export {
  setTitle,
  getPlatform,
  getControlChar,
  getCookie,
};
