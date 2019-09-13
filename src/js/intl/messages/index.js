import clusterMessages from './cluster';
import dashboardMessages from './dashboard';
import dropdownMessages from './dropdown';
import globalMessages from './global';
import settingsMessages from './settings';
import statsMessages from './stats';
import systemMessages from './system';
import tableMessages from './table';
import treeMessages from './tree';
import userMessages from './user';

const LANGS = {
  CZ: 'cs-CZ',
  GB: 'en-GB',
  EN: 'en-US',
  DE: 'de-DE',
};

export default function (locale: string): Object {
  return {
    ...clusterMessages[locale],
    ...dashboardMessages[locale],
    ...dropdownMessages[locale],
    ...globalMessages[locale],
    ...settingsMessages[locale],
    ...statsMessages[locale],
    ...systemMessages[locale],
    ...tableMessages[locale],
    ...treeMessages[locale],
    ...userMessages[locale],
  };
}

export { LANGS };
