import classNames from 'classnames';

export function statusHealth(health) {
  return classNames({
    danger: health === 'RED',
    success: health === 'GREEN',
    warning: health === 'YELLOW' || health === 'UNKNOWN' || health === 'UNREACHABLE',
  });
}
