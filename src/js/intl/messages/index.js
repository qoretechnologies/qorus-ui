import systemMessages from './system';
import globalMessages from './global';

const LANGS = {
  CZ: 'cs-CZ',
  GB: 'en-GB',
  EN: 'en-US',
  DE: 'de-DE',
};

export default function (locale: string): Object {
  return {
    ...systemMessages[locale],
    ...globalMessages[locale],
  };
}

export { LANGS };
