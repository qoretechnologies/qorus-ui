import systemMessages from './system';

const LANGS = {
  CZ: 'cs-CZ',
  GB: 'en-GB',
  DE: 'de-DE',
};

export default function (locale: string): Object {
  return {
    ...systemMessages[locale],
  };
}

export { LANGS };
