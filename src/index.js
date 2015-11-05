require('babel/polyfill');

import ReactDOM from 'react-dom';
import App from './js/app';
import history from './js/history';

ReactDOM.render(<App history={history} />, document.getElementById('app'));
