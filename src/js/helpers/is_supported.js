import browser from 'bowser';


/**
 * Check can we run app on users browser
 */
export default function isSupported(userAgent) {
  return browser.check(
    {
      chrome: '14',
      firefox: '11',
      opera: '12.1',
      safari: '6',
      msie: '10',
    },
    userAgent
  );
}
