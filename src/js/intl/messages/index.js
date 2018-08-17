import systemMessages from './system';

const LANGS = {
  CZ: 'cs-CZ',
  GB: 'en-GB',
  EN: 'en-US',
  DE: 'de-DE',
};

export default function(locale: string): Object {
  return {
    ...systemMessages[locale],
  };
}

export { LANGS };
