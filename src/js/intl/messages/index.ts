import buttonMessages from './button';
import clusterMessages from './cluster';
import componentMessages from './component';
import dashboardMessages from './dashboard';
import datetimeMessages from './datetime';
import dialogMessages from './dialog';
import dropdownMessages from './dropdown';
import globalMessages from './global';
import loggerMessages from './logger';
import orderMessages from './order';
import settingsMessages from './settings';
import statsMessages from './stats';
import summaryMessages from './summary';
import systemMessages from './system';
import tableMessages from './table';
import tabsMessages from './tabs';
import treeMessages from './tree';
import userMessages from './user';

const LANGS = {
  CZ: 'cs-CZ',
  EN: 'en-US',
  JP: 'ja-JP',
};

export default function (locale: string): Object {
  return {
    ...buttonMessages[locale],
    ...clusterMessages[locale],
    ...componentMessages[locale],
    ...dashboardMessages[locale],
    ...datetimeMessages[locale],
    ...dialogMessages[locale],
    ...dropdownMessages[locale],
    ...globalMessages[locale],
    ...loggerMessages[locale],
    ...orderMessages[locale],
    ...settingsMessages[locale],
    ...statsMessages[locale],
    ...summaryMessages[locale],
    ...systemMessages[locale],
    ...tableMessages[locale],
    ...tabsMessages[locale],
    ...treeMessages[locale],
    ...userMessages[locale],
  };
}

export { LANGS };
