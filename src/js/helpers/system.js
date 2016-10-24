/* @flow */
import classNames from 'classnames';

const statusHealth: Function = (health: string): string => (
  classNames({
    danger: health === 'RED',
    success: health === 'GREEN',
    warning: health === 'YELLOW' || health === 'UNKNOWN' || health === 'UNREACHABLE',
  })
);

const utf8ToB64: Function = (str: string): string => (
  window.btoa(encodeURIComponent(str))
);

export {
  statusHealth,
  utf8ToB64,
};
